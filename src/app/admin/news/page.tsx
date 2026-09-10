import { adminResources } from '@/lib/admin-resources';
import AdminList from '@/components/admin/AdminList';

export default function AdminNewsPage() {
  return <AdminList resource={adminResources.news} />;
}
