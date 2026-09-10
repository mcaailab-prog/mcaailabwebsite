import { adminResources } from '@/lib/admin-resources';
import AdminList from '@/components/admin/AdminList';

export default function AdminInnovationsPage() {
  return <AdminList resource={adminResources.innovations} />;
}
