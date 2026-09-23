import Link from 'next/link';

const cards = [
  { href: '/admin/news', title: 'News', body: 'Publish and update news articles shown on the public site.' },
  { href: '/admin/events', title: 'Events', body: 'Manage upcoming and featured events.' },
  { href: '/admin/team', title: 'Team members', body: 'Add, edit, and remove people shown on the public team pages.' },
  { href: '/admin/projects', title: 'Projects', body: 'Edit the project registry, members, funders, and links.' },
  { href: '/admin/research', title: 'Research areas', body: 'Add lab programmes such as MT, ASR, synthetic data, AI4KSL, and systems.' },
  { href: '/admin/collaborations', title: 'Collaborations', body: 'Add partner pages (Princeton, Microsoft, DSA, ACTS, Google, and more).' },
  { href: '/admin/innovations', title: 'Innovations', body: 'Document lab tools and access links.' },
  { href: '/admin/datasets', title: 'Datasets', body: 'Set Hugging Face, GitHub, or other download URLs for public dataset pages.' },
  { href: '/admin/careers', title: 'Career tracks', body: 'Open application windows and describe qualifications.' },
  { href: '/admin/inbox', title: 'Inbox', body: 'Read contact messages and career applications.' },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="font-headline text-3xl text-university-deep-blue">Dashboard</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
        This panel is hidden from the public site. Create or edit records here and they appear on the matching public pages.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-outline-variant bg-white p-5 transition hover:border-university-deep-blue"
          >
            <h2 className="font-headline text-lg text-university-deep-blue">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-on-surface-variant">{card.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
