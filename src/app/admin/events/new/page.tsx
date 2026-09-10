import AdminEditor from '@/components/admin/AdminEditor';
import { adminResources } from '@/lib/admin-resources';

export default function NewEventPage() {
  return <AdminEditor resource={adminResources.events} />;
}
