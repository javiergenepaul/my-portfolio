"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getContentType } from "@/components/admin/admin-config";
import { ContentEditForm } from "@/components/admin/content-edit-form";
import { getMockRow } from "@/components/admin/mock-data";

export default function AdminEditPage() {
  const { type: typeKey, id } = useParams<{ type: string; id: string }>();
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
  const row = isNew ? undefined : getMockRow(type.key, id);

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

  return <ContentEditForm type={type} row={row} />;
}
