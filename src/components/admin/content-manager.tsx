"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, RotateCcw, Loader2 } from "lucide-react";
import { Button, useToast } from "@/components";
import { getContentType, type ContentRow } from "./admin-config";
import { replaceContentRows } from "@/lib/content/actions";
import { ContentList } from "./content-list";
import { ContentEditForm } from "./content-edit-form";

/**
 * DB-backed manager for a single content type (the non-résumé types).
 *
 * List types mirror the résumé flow: edit freely into a working draft, then
 * commit with one Save that replaces the whole table for this type in a single
 * server action — adds / edits / deletes / reorders persist together. Reset
 * reverts to the last saved snapshot.
 *
 * Singletons (Profile) render the edit form directly; it persists on its own
 * Save, so they skip the draft/Save-bar model.
 *
 * Receives `typeKey` (serializable) rather than the type def, because the def
 * carries a React icon component that can't cross the server→client boundary.
 */
export function ContentManager({
  typeKey,
  initialRows,
}: {
  typeKey: string;
  initialRows: ContentRow[];
}) {
  const type = getContentType(typeKey);
  const { toast } = useToast();
  const router = useRouter();

  const [savedRows, setSavedRows] = useState<ContentRow[]>(() =>
    structuredClone(initialRows),
  );
  const [rows, setRows] = useState<ContentRow[]>(() =>
    structuredClone(initialRows),
  );
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!type) {
    return (
      <div className="max-w-md">
        <h1 className="text-lg font-semibold">Unknown content type</h1>
        <p className="text-sm text-muted-foreground mt-1">
          There&apos;s no content type called{" "}
          <code className="text-foreground">{typeKey}</code>.
        </p>
      </div>
    );
  }

  // Singleton: the standalone form persists itself — no draft layer needed.
  if (type.singleton) {
    return <ContentEditForm type={type} row={rows[0]} />;
  }

  const applyRows = (next: ContentRow[]) => {
    setRows(next);
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await replaceContentRows(
        type.key,
        rows.map((r) => ({
          // Rows added in the admin carry a temporary client id — drop it so
          // they're inserted rather than treated as an existing row.
          id: r.id.startsWith("tmp-") ? undefined : r.id,
          published: r.published,
          values: r.values,
        })),
      );
      setSavedRows(structuredClone(rows));
      setDirty(false);
      toast({
        title: `${type.label} saved`,
        description: "Your changes are live in the database.",
        duration: 3000,
      });
      router.refresh();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: e instanceof Error ? e.message : "Unknown error",
        duration: 8000,
      });
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setRows(structuredClone(savedRows));
    setDirty(false);
    toast({
      title: "Changes discarded",
      description: "Reverted to the last saved version.",
      duration: 2000,
    });
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold flex items-center gap-2.5">
            <type.icon size={22} className="text-primary" />
            {type.label}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {type.description}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {dirty && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-amber-500">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Unsaved changes
            </span>
          )}
          {dirty && (
            <Button
              variant="outline"
              onClick={reset}
              disabled={saving}
              className="gap-1.5"
            >
              <RotateCcw size={15} /> Reset
            </Button>
          )}
          <Button
            onClick={() => void save()}
            disabled={!dirty || saving}
            className="gap-1.5"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      <ContentList type={type} embedded rows={rows} onRowsChange={applyRows} />
    </div>
  );
}
