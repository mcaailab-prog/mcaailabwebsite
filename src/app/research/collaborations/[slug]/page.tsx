import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import CollaborationView from '@/components/collaborations/CollaborationView';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collaboration = await api.getCollaborationBySlug(slug);
  return {
    title: collaboration ? `${collaboration.title} — MCAAI` : 'Collaboration — MCAAI',
    description: collaboration?.summary,
  };
}

export default async function CollaborationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collaboration = await api.getCollaborationBySlug(slug);
  if (!collaboration) notFound();
  return <CollaborationView collaboration={collaboration} />;
}
