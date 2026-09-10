import AdminEditor from '@/components/admin/AdminEditor';
import { adminResources } from '@/lib/admin-resources';

export default function NewCareerPage() {
  return <AdminEditor resource={adminResources.careers} />;
}
