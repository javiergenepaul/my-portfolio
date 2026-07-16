import Link from "next/link";
import { getContentType } from "@/components/admin/admin-config";
import { ContentManager } from "@/components/admin/content-manager";
import { getAdminRows, getAdminSingleton } from "@/lib/content/repository";

export default async function AdminTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type: typeKey } = await params;
  const type = getContentType(typeKey);

  if (!type) {
    return (
      <div className="max-w-md">
        <h1 className="text-lg font-semibold">Unknown content type</h1>
        <p className="text-sm text-muted-foreground mt-1">
          There&apos;s no content type called{" "}
          <code className="text-foreground">{typeKey}</code>.
        </p>
        <Link href="/admin" className="text-sm text-primary mt-3 inline-block">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const initialRows = type.singleton
    ? [await getAdminSingleton(type)].filter((r) => r != null)
    : await getAdminRows(type);

  return <ContentManager typeKey={type.key} initialRows={initialRows} />;
}
