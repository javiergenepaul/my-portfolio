"use client";

import Link from "next/link";
import { getContentType, type ContentRow } from "./admin-config";
import { ContentEditForm } from "./content-edit-form";

/**
 * Client boundary for the standalone edit page (`/admin/[type]/[id]`).
 *
 * The server route can't pass the type def across the RSC boundary (it holds a
 * React icon component), so it passes the serializable `typeKey` + `row` and we
 * resolve the def here.
 */
export function ContentEditClient({
  typeKey,
  row,
}: {
  typeKey: string;
  row?: ContentRow;
}) {
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
  return <ContentEditForm type={type} row={row} />;
}
