import { adminResources } from '@/lib/admin-resources';
import AdminList from '@/components/admin/AdminList';

export default function AdminPartnersPage() {
  return <AdminList resource={adminResources.partners} />;
}
