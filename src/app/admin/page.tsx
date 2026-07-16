import { Dashboard } from "@/components/admin/dashboard";
import { getAdminCounts } from "@/lib/content/repository";

export default async function AdminDashboardPage() {
  const counts = await getAdminCounts();
  return <Dashboard counts={counts} />;
}
