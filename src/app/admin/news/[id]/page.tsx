import AdminEditor from '@/components/admin/AdminEditor';
import { adminResources } from '@/lib/admin-resources';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminEditor resource={adminResources.news} id={id} />;
}
