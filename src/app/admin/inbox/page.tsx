'use client';

import { useEffect, useMemo, useState } from 'react';
import { FiDownload, FiMail, FiSend } from 'react-icons/fi';

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

function escapeCsv(value: string | undefined | null) {
  const text = String(value ?? '');
  const normalized = text.replace(/\r\n/g, '\n').replace(/"/g, '""');
  return `"${normalized}"`;
}

function buildInboxCsv(rows: Array<Record<string, string | undefined>>) {
  const headers = ['type', 'name', 'email', 'subject', 'track', 'message', 'submitted_at'];
  const body = rows.map((row) =>
    headers.map((header) => escapeCsv(row[header] ?? '')).join(','),
  );
  return [headers.map((header) => escapeCsv(header)).join(','), ...body].join('\n');
}

function createMailtoHref({
  email,
  name,
  subject,
  message,
}: {
  email: string;
  name?: string;
  subject?: string;
  message?: string;
}) {
  const finalSubject = subject || 'MCAAI follow-up';
  const finalBody = [
    `Hello ${name || 'there'},`,
    '',
    'Thank you for your message.',
    '',
    '--- Original message ---',
    message || '',
  ].join('\n');

  return `mailto:${email}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(finalBody)}`;
}

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

  const allInboxRows = useMemo(
    () => [
      ...contacts.map((item) => ({
        type: 'Contact',
        name: item.name,
        email: item.email,
        subject: item.subject,
        track: '',
        message: item.message,
        submitted_at: item.createdAt || '',
      })),
      ...applications.map((item) => ({
        type: 'Career application',
        name: `${item.first_name} ${item.last_name}`.trim(),
        email: item.email,
        subject: item.track_name || 'Application',
        track: item.track_name || '',
        message: item.motivation,
        submitted_at: item.createdAt || '',
      })),
    ],
    [contacts, applications],
  );

  const exportAll = () => {
    const csv = buildInboxCsv(allInboxRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mcaai-inbox-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-headline text-2xl text-university-deep-blue">Inbox</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Contact form messages and career applications.</p>
        </div>
        <button
          type="button"
          onClick={exportAll}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-university-deep-blue px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm hover:bg-[#0f2b59]"
          disabled={allInboxRows.length === 0}
        >
          <FiDownload className="h-4 w-4" />
          Export CSV
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-error">{error}</p> : null}

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-headline text-lg">Career applications</h2>
          <button
            type="button"
            onClick={() => {
              const csv = buildInboxCsv(
                applications.map((item) => ({
                  type: 'Career application',
                  name: `${item.first_name} ${item.last_name}`.trim(),
                  email: item.email,
                  subject: item.track_name || 'Application',
                  track: item.track_name || '',
                  message: item.motivation,
                  submitted_at: item.createdAt || '',
                })),
              );
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'mcaai-career-applications.csv';
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-on-surface hover:bg-surface-variant"
            disabled={applications.length === 0}
          >
            <FiDownload className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-white">
          {applications.map((item) => (
            <article key={item.id || item.email} className="border-b border-outline-variant px-4 py-4 last:border-b-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium">{item.first_name} {item.last_name}</p>
                  <p className="text-sm text-on-surface-variant">{item.email} · {item.track_name || 'General'}</p>
                </div>
                <a
                  href={createMailtoHref({
                    email: item.email,
                    name: `${item.first_name} ${item.last_name}`.trim(),
                    subject: `Re: ${item.track_name || 'MCAAI application'}`,
                    message: item.motivation,
                  })}
                  className="inline-flex items-center gap-2 rounded-lg border border-outline-variant px-3 py-2 text-xs font-semibold uppercase tracking-wide text-on-surface hover:bg-surface-variant"
                >
                  <FiMail className="h-3.5 w-3.5" />
                  Reply
                </a>
              </div>
              <p className="mt-2 text-sm leading-6">{item.motivation}</p>
            </article>
          ))}
          {applications.length === 0 ? <p className="px-4 py-8 text-sm text-on-surface-variant">No applications yet.</p> : null}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-headline text-lg">Contact messages</h2>
          <button
            type="button"
            onClick={() => {
              const csv = buildInboxCsv(
                contacts.map((item) => ({
                  type: 'Contact',
                  name: item.name,
                  email: item.email,
                  subject: item.subject,
                  track: '',
                  message: item.message,
                  submitted_at: item.createdAt || '',
                })),
              );
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'mcaai-contact-messages.csv';
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-on-surface hover:bg-surface-variant"
            disabled={contacts.length === 0}
          >
            <FiDownload className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border border-outline-variant bg-white">
          {contacts.map((item) => (
            <article key={item.id || item.email + item.subject} className="border-b border-outline-variant px-4 py-4 last:border-b-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium">{item.name} — {item.subject}</p>
                  <p className="text-sm text-on-surface-variant">{item.email}</p>
                </div>
                <a
                  href={createMailtoHref({
                    email: item.email,
                    name: item.name,
                    subject: `Re: ${item.subject || 'MCAAI inquiry'}`,
                    message: item.message,
                  })}
                  className="inline-flex items-center gap-2 rounded-lg border border-outline-variant px-3 py-2 text-xs font-semibold uppercase tracking-wide text-on-surface hover:bg-surface-variant"
                >
                  <FiSend className="h-3.5 w-3.5" />
                  Reply
                </a>
              </div>
              <p className="mt-2 text-sm leading-6">{item.message}</p>
            </article>
          ))}
          {contacts.length === 0 ? <p className="px-4 py-8 text-sm text-on-surface-variant">No messages yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
