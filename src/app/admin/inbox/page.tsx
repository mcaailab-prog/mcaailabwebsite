'use client';

import { useEffect, useState } from 'react';

type ContactRow = {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
};

type ApplicationRow = {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  affiliation?: string;
  track_name?: string;
  motivation: string;
  createdAt?: string;
};

export default function AdminInboxPage() {
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/contact').then((res) => res.json()),
      fetch('/api/careers/applications').then((res) => res.json()),
    ])
      .then(([contactData, applicationData]) => {
        if (Array.isArray(contactData)) setContacts(contactData);
        if (Array.isArray(applicationData)) setApplications(applicationData);
        if (!Array.isArray(contactData) && contactData.error) setError(contactData.error);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline text-2xl text-university-deep-blue">Inbox</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Contact form messages and career applications.</p>
        {error ? <p className="mt-2 text-sm text-error">{error}</p> : null}
      </div>

      <section>
        <h2 className="mb-3 font-headline text-lg">Career applications</h2>
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-white">
          {applications.map((item) => (
            <article key={item.id || item.email} className="border-b border-outline-variant px-4 py-4 last:border-b-0">
              <p className="font-medium">{item.first_name} {item.last_name}</p>
              <p className="text-sm text-on-surface-variant">{item.email} · {item.track_name || 'General'}</p>
              <p className="mt-2 text-sm leading-6">{item.motivation}</p>
            </article>
          ))}
          {applications.length === 0 ? <p className="px-4 py-8 text-sm text-on-surface-variant">No applications yet.</p> : null}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-headline text-lg">Contact messages</h2>
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-white">
          {contacts.map((item) => (
            <article key={item.id || item.email + item.subject} className="border-b border-outline-variant px-4 py-4 last:border-b-0">
              <p className="font-medium">{item.name} — {item.subject}</p>
              <p className="text-sm text-on-surface-variant">{item.email}</p>
              <p className="mt-2 text-sm leading-6">{item.message}</p>
            </article>
          ))}
          {contacts.length === 0 ? <p className="px-4 py-8 text-sm text-on-surface-variant">No messages yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
