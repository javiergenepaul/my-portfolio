import Link from "next/link";
import { getContentType } from "@/components/admin/admin-config";
import { ContentEditClient } from "@/components/admin/content-edit-client";
import { getAdminRows } from "@/lib/content/repository";

export default async function AdminEditPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type: typeKey, id } = await params;
  const type = getContentType(typeKey);

  if (!type) {
    return (
      <div className="max-w-md">
        <h1 className="text-lg font-semibold">Unknown content type</h1>
        <Link href="/admin" className="text-sm text-primary mt-3 inline-block">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const isNew = id === "new";
  const row = isNew
    ? undefined
    : (await getAdminRows(type)).find((r) => r.id === id);

  if (!isNew && !row) {
    return (
      <div className="max-w-md">
        <h1 className="text-lg font-semibold">Not found</h1>
        <p className="text-sm text-muted-foreground mt-1">
          No {type.singular.toLowerCase()} with id{" "}
          <code className="text-foreground">{id}</code>.
        </p>
        <Link
          href={`/admin/${type.key}`}
          className="text-sm text-primary mt-3 inline-block"
        >
          ← Back to {type.label.toLowerCase()}
        </Link>
      </div>
    );
  }

  return <ContentEditClient typeKey={type.key} row={row} />;
}
