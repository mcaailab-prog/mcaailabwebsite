import PublicationsClient from './PublicationsClient';
import { api } from '@/lib/api';
import type { PublicationType } from '@/lib/api';

function serializePublications(data: PublicationType[]): PublicationType[] {
  return JSON.parse(JSON.stringify(data));
}

export default async function PublicationsPage() {
  let publications: PublicationType[] = [];
  try {
    const raw = await api.getPublications();
    publications = serializePublications(raw);
  } catch (err) {
    console.error('Failed to fetch publications:', err);
  }
  return <PublicationsClient publications={publications} />;
}