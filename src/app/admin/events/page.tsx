import { adminResources } from '@/lib/admin-resources';
import AdminList from '@/components/admin/AdminList';

export default function AdminEventsPage() {
  return <AdminList resource={adminResources.events} />;
}
