import * as dotenv from 'dotenv';
import { connectDB } from '@/app/api/utils/connectDB';
import { AdminUser } from '@/app/api/models/AdminUser';

dotenv.config();

const normalizeHash = async (value: string) => {
  const encoded = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

async function main() {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Site Administrator';

  const passwordHash = await normalizeHash(password);

  await AdminUser.deleteMany({});

  const user = await AdminUser.create({
    email,
    name,
    passwordHash,
    isActive: true,
  });

  console.log(`Admin user seeded for ${user.email} (${user.name})`);
}

main().catch((error) => {
  console.error('Failed to seed admin user:', error);
  process.exit(1);
});
