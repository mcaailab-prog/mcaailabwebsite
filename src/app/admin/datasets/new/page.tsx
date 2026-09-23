import AdminEditor from '@/components/admin/AdminEditor';
import { adminResources } from '@/lib/admin-resources';

export default function NewDatasetPage() {
  return <AdminEditor resource={adminResources.datasets} />;
}
