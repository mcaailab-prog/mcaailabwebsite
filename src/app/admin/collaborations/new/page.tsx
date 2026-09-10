import AdminEditor from '@/components/admin/AdminEditor';
import { adminResources } from '@/lib/admin-resources';

export default function NewCollaborationPage() {
  return <AdminEditor resource={adminResources.collaborations} />;
}
