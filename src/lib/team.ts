export function isPublicationCollaborator(member: { title?: string | null }) {
  return (member.title ?? '').trim().toLowerCase() === 'collaborator';
}

export function isLabTeamMember(member: { title?: string | null }) {
  return !isPublicationCollaborator(member);
}
