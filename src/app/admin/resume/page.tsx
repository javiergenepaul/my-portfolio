import {
  CONTENT_TYPES,
  type ContentRow,
} from "@/components/admin/admin-config";
import { getAdminRows } from "@/lib/content/repository";
import { ResumeManager } from "@/components/admin/resume-manager";

export default async function AdminResumePage() {
  const sections = CONTENT_TYPES.filter((t) => t.group === "Resume");

  // Fetched server-side (drafts included — RLS lets the signed-in admin see all).
  const entries = await Promise.all(
    sections.map(async (t) => [t.key, await getAdminRows(t)] as const),
  );

  return (
    <ResumeManager
      initialSections={
        Object.fromEntries(entries) as Record<string, ContentRow[]>
      }
    />
  );
}
