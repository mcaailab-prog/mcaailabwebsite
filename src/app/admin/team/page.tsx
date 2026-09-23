import { adminResources } from '@/lib/admin-resources';
import AdminList from '@/components/admin/AdminList';

export default function AdminTeamPage() {
  return <AdminList resource={adminResources.team} />;
}
