import { adminResources } from '@/lib/admin-resources';
import AdminEditor from '@/components/admin/AdminEditor';

export default function AdminNewPartnerPage() {
  return <AdminEditor resource={adminResources.partners} />;
}
