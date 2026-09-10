import { Suspense } from 'react';
import AdminLoginPage from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#0b1f4d] text-white">Loading…</div>}>
      <AdminLoginPage />
    </Suspense>
  );
}
