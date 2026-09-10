import { Metadata } from 'next';
import { api } from '@/lib/api';
import type { TeamMemberType } from '@/lib/api-types';
import TeamPageClient from './TeamPageClient';

export const metadata: Metadata = {
  title: 'Our Team - MCAAI',
  description:
    'Meet the researchers, faculty, and staff driving innovation at the Maseno Centre for Applied Artificial Intelligence.',
};

function serializeMember(m: TeamMemberType): TeamMemberType {
  let photo = m.photo as string | null | undefined;

  if (photo != null) {
    if ((photo as any) instanceof Uint8Array || Buffer.isBuffer(photo)) {
      // Raw binary blob → base64 data URL (JPEG assumed; change mime if needed)
      photo = `data:image/jpeg;base64,${Buffer.from(photo).toString('base64')}`;
    } else if (
      typeof photo === 'object' &&
      (photo as any).type === 'Buffer' &&
      Array.isArray((photo as any).data)
    ) {
      // JSON-serialised Buffer: { type: 'Buffer', data: [...] }
      photo = `data:image/jpeg;base64,${Buffer.from((photo as any).data).toString('base64')}`;
    }
    // If it's already a string URL, leave it untouched
  }

  return { ...m, photo: photo ?? null } as TeamMemberType;
}

export default async function TeamPage() {
  const raw = await api.getTeamMembers();
  const teamMembers = (raw as TeamMemberType[]).map(serializeMember);
  return <TeamPageClient teamMembers={teamMembers} />;
}