import { adminResources } from '@/lib/admin-resources';
import AdminList from '@/components/admin/AdminList';

export default function AdminCollaborationsPage() {
  return <AdminList resource={adminResources.collaborations} />;
}
