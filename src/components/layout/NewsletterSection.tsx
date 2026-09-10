'use client';

import { useState } from 'react';

export default function NewsletterStrip() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-6 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-y border-outline-variant/30">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center gap-4">

        <p className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap shrink-0">
         Subscribe to our Newsletter
        </p>

        {status === 'success' ? (
          <p className="font-label-sm text-label-sm text-secondary">
            ✓ Subscribed — check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-1 w-full">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-2 rounded-l-lg border border-outline-variant bg-white focus:outline-none focus:ring-1 focus:ring-mcaai-teal font-body-md text-body-md text-[14px]"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-university-deep-blue text-on-primary px-5 py-2 rounded-r-lg font-label-sm text-label-sm hover:bg-primary transition-colors disabled:opacity-60"
            >
              {status === 'loading' ? '…' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="font-label-sm text-label-sm text-error">Something went wrong.</p>
        )}

      </div>
    </section>
  );
}