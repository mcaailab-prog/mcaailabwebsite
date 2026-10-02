import { adminResources } from '@/lib/admin-resources';
import AdminList from '@/components/admin/AdminList';

export default function AdminUsersPage() {
  return <AdminList resource={adminResources.adminUsers} />;
}
