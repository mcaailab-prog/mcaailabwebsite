import { adminResources } from '@/lib/admin-resources';
import AdminList from '@/components/admin/AdminList';

export default function AdminCareersPage() {
  return <AdminList resource={adminResources.careers} />;
}
