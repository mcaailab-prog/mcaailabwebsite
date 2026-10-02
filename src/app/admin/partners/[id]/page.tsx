import { adminResources } from '@/lib/admin-resources';
import AdminEditor from '@/components/admin/AdminEditor';

export default async function AdminPartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminEditor resource={adminResources.partners} id={id} />;
}
