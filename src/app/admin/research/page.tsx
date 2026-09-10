import { adminResources } from '@/lib/admin-resources';
import AdminList from '@/components/admin/AdminList';

export default function AdminResearchPage() {
  return <AdminList resource={adminResources.research} />;
}
