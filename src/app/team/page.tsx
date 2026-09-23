import { Metadata } from 'next';
import { api } from '@/lib/api';
import type { TeamMemberType } from '@/lib/api-types';
import { isLabTeamMember } from '@/lib/team';
import TeamPageClient from './TeamPageClient';

export const metadata: Metadata = {
  title: 'Our Team - MCAAI',
  description:
    'Meet the researchers, faculty, and staff driving innovation at the Maseno Centre for Applied Artificial Intelligence.',
};

function isSerializedBuffer(value: unknown): value is { type: 'Buffer'; data: number[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as Record<string, unknown>).type === 'Buffer' &&
    Array.isArray((value as Record<string, unknown>).data)
  );
}

function serializeMember(m: TeamMemberType): TeamMemberType {
  // `photo` is declared as `string | null` but MongoDB can hand back a raw
  // binary blob (or its JSON-serialised form) for legacy records, so it's
  // read as `unknown` here and narrowed before use rather than trusted.
  let photo: unknown = m.photo;

  if (photo != null) {
    if (photo instanceof Uint8Array || Buffer.isBuffer(photo)) {
      // Raw binary blob → base64 data URL (JPEG assumed; change mime if needed)
      photo = `data:image/jpeg;base64,${Buffer.from(photo).toString('base64')}`;
    } else if (isSerializedBuffer(photo)) {
      // JSON-serialised Buffer: { type: 'Buffer', data: [...] }
      photo = `data:image/jpeg;base64,${Buffer.from(photo.data).toString('base64')}`;
    }
    // If it's already a string URL, leave it untouched
  }

  return { ...m, photo: (photo as string | null) ?? null };
}

export default async function TeamPage() {
  const raw = await api.getTeamMembers();
  const teamMembers = (raw as TeamMemberType[]).filter(isLabTeamMember).map(serializeMember);
  return <TeamPageClient teamMembers={teamMembers} />;
}