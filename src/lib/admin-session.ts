const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function loadDbDeps() {
  const [{ AdminConfig }, { AdminUser }, { connectDB }] = await Promise.all([
    import('@/app/api/models/AdminConfig'),
    import('@/app/api/models/AdminUser'),
    import('@/app/api/utils/connectDB'),
  ]);

  return { AdminConfig, AdminUser, connectDB };
}

export const ADMIN_COOKIE = 'mcaai_admin';
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export type AdminSession = {
  email: string;
  name: string;
  exp: number;
};

function toBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = '';
  arr.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function hashPassword(value: string) {
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function generateSessionSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function ensureDbSessionSecret() {
  if (process.env.ADMIN_SESSION_SECRET?.trim()) {
    return process.env.ADMIN_SESSION_SECRET.trim();
  }

  const { AdminConfig, connectDB } = await loadDbDeps();
  await connectDB();
  const existing = await AdminConfig.findOne({ key: 'admin_session_secret' }).lean();
  if (existing?.value) {
    return String(existing.value);
  }

  const secret = generateSessionSecret();
  await AdminConfig.findOneAndUpdate(
    { key: 'admin_session_secret' },
    { key: 'admin_session_secret', value: secret },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return secret;
}

export async function getSessionSecret() {
  return ensureDbSessionSecret();
}

export async function createSessionToken(user: { email: string; name: string }, secret?: string) {
  const resolvedSecret = secret ?? (await getSessionSecret());
  if (!resolvedSecret) {
    throw new Error('Admin session secret is not set');
  }
  const payload: AdminSession = {
    email: user.email,
    name: user.name,
    exp: Date.now() + SESSION_MS,
  };
  const body = JSON.stringify(payload);
  const key = await hmacKey(resolvedSecret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  return `${toBase64Url(encoder.encode(body))}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(token: string | undefined | null, secret?: string): Promise<AdminSession | null> {
  const resolvedSecret = secret ?? (await getSessionSecret());
  if (!token || !resolvedSecret) return null;
  const [payloadPart, signaturePart] = token.split('.');
  if (!payloadPart || !signaturePart) return null;

  try {
    const body = decoder.decode(fromBase64Url(payloadPart));
    const key = await hmacKey(resolvedSecret);
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(signaturePart),
      encoder.encode(body),
    );
    if (!valid) return null;
    const session = JSON.parse(body) as AdminSession;
    if (!session?.email || !session.exp || session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function parseAdminUsers(): Promise<{ email: string; passwordHash: string; name: string }[]> {
  const { AdminUser, connectDB } = await loadDbDeps();
  await connectDB();

  const users = await AdminUser.find({ isActive: { $ne: false } }).lean();
  const envRaw = process.env.ADMIN_USERS;

  if (users.length === 0 && envRaw) {
    try {
      const parsed = JSON.parse(envRaw) as { email?: string; password?: string; name?: string }[];
      if (Array.isArray(parsed)) {
        for (const user of parsed) {
          if (!user.email || !user.password) continue;
          const email = String(user.email).trim().toLowerCase();
          await AdminUser.findOneAndUpdate(
            { email },
            {
              email,
              name: user.name?.trim() || String(user.email),
              passwordHash: await hashPassword(String(user.password)),
              isActive: true,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );
        }
      }
    } catch {
      // Ignore legacy env parsing errors and continue using the DB-only value.
    }
  }

  const storedUsers = await AdminUser.find({ isActive: { $ne: false } }).lean();
  return storedUsers.map((user) => ({
    email: String(user.email).trim().toLowerCase(),
    passwordHash: String(user.passwordHash),
    name: user.name?.trim() || String(user.email),
  }));
}

export async function findAdminUser(email: string, password: string) {
  const users = await parseAdminUsers();
  const normalized = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);

  const match = users.find((user) => user.email === normalized && user.passwordHash === passwordHash) ?? null;
  if (match) {
    return { email: match.email, name: match.name };
  }

  return null;
}

export async function getSessionFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]+)`));
  if (!match?.[1]) return null;
  return verifySessionToken(decodeURIComponent(match[1]));
}
