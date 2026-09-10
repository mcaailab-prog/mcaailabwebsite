import { adminResources } from '@/lib/admin-resources';
import AdminList from '@/components/admin/AdminList';

export default function AdminProjectsPage() {
  return <AdminList resource={adminResources.projects} />;
}
