"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getContentType } from "@/components/admin/admin-config";
import { ContentList } from "@/components/admin/content-list";
import { ContentEditForm } from "@/components/admin/content-edit-form";
import { getMockRow } from "@/components/admin/mock-data";

export default function AdminTypePage() {
  const { type: typeKey } = useParams<{ type: string }>();
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

  // Singletons (Profile) edit their single record directly — no list view.
  if (type.singleton) {
    return <ContentEditForm type={type} row={getMockRow(type.key, type.key)} />;
  }

  return <ContentList type={type} />;
}
