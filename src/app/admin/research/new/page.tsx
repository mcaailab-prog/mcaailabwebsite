import AdminEditor from '@/components/admin/AdminEditor';
import { adminResources } from '@/lib/admin-resources';

export default function NewResearchPage() {
  return <AdminEditor resource={adminResources.research} />;
}
