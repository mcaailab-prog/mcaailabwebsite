const encoder = new TextEncoder();
const decoder = new TextDecoder();

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

export function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || '';
}

export async function createSessionToken(user: { email: string; name: string }, secret = getSessionSecret()) {
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not set');
  }
  const payload: AdminSession = {
    email: user.email,
    name: user.name,
    exp: Date.now() + SESSION_MS,
  };
  const body = JSON.stringify(payload);
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  return `${toBase64Url(encoder.encode(body))}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(token: string | undefined | null, secret = getSessionSecret()): Promise<AdminSession | null> {
  if (!token || !secret) return null;
  const [payloadPart, signaturePart] = token.split('.');
  if (!payloadPart || !signaturePart) return null;

  try {
    const body = decoder.decode(fromBase64Url(payloadPart));
    const key = await hmacKey(secret);
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

export function parseAdminUsers(): { email: string; password: string; name: string }[] {
  const raw = process.env.ADMIN_USERS;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as { email?: string; password?: string; name?: string }[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((user) => user.email && user.password)
      .map((user) => ({
        email: String(user.email).trim().toLowerCase(),
        password: String(user.password),
        name: user.name?.trim() || String(user.email),
      }));
  } catch {
    return [];
  }
}

export function findAdminUser(email: string, password: string) {
  const users = parseAdminUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((user) => user.email === normalized && user.password === password) ?? null;
}

export async function getSessionFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]+)`));
  if (!match?.[1]) return null;
  return verifySessionToken(decodeURIComponent(match[1]));
}
