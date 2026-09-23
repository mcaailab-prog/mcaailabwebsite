import { adminResources } from '@/lib/admin-resources';
import AdminList from '@/components/admin/AdminList';

export default function AdminDatasetsPage() {
  return <AdminList resource={adminResources.datasets} />;
}
