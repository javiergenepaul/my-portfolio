"use client";

import { useState } from "react";
import { Plus, Pencil, GripVertical, X, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  useToast,
} from "@/components";
import { cn } from "@/lib/utils";
import {
  type ContentTypeDef,
  type ContentRow,
  type FieldValue,
  LOCALES,
  displayValue,
} from "./admin-config";
import { Sheet, SheetContent, SheetClose, SheetTitle } from "./sheet";
import { ContentEditForm } from "./content-edit-form";

/** Which locales have a non-empty value for a localized field. */
function filledLocales(value: FieldValue | undefined): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return LOCALES.filter((l) => (value[l.code] ?? "").trim().length > 0).map(
    (l) => l.code,
  );
}

export function ContentList({
  type,
  embedded = false,
  rows: controlledRows,
  onRowsChange,
}: {
  type: ContentTypeDef;
  embedded?: boolean;
  /** Draft mode: controlled rows + change handler (no mock reads, no toasts). */
  rows?: ContentRow[];
  onRowsChange?: (rows: ContentRow[]) => void;
}) {
  const rows = controlledRows ?? [];
  const primaryLocalized = type.fields.find(
    (f) => f.name === type.primaryField,
  )?.localized;
  // Header for the secondary column = that field's label (e.g. "Category"),
  // falling back to a generic label.
  const secondaryLabel =
    type.fields.find((f) => f.name === type.secondaryField)?.label ?? "Detail";

  // Drawer state: `target` holds the row being edited ("new" for create); it's
  // kept while closing so the slide-out animation still has content to show.
  const [target, setTarget] = useState<ContentRow | "new" | null>(null);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<ContentRow | null>(null);
  const { toast } = useToast();

  const openNew = () => {
    setTarget("new");
    setOpen(true);
  };
  const openEdit = (row: ContentRow) => {
    setTarget(row);
    setOpen(true);
  };
  const confirmDelete = () => {
    if (onRowsChange && deleting) {
      onRowsChange(rows.filter((r) => r.id !== deleting.id));
    } else {
      toast({
        variant: "destructive",
        title: "Deleted (simulated)",
        description:
          "No data was actually removed — persistence comes with Supabase.",
        duration: 3000,
      });
    }
    setDeleting(null);
  };

  // Draft mode: apply an added/edited row to the controlled list.
  const handleItemSubmit = (data: {
    id?: string;
    published: boolean;
    values: Record<string, FieldValue>;
  }) => {
    if (!onRowsChange) return;
    if (target === "new") {
      onRowsChange([
        ...rows,
        {
          id: `tmp-${Date.now()}`,
          published: data.published,
          order: rows.length,
          values: data.values,
        },
      ]);
    } else if (target) {
      onRowsChange(
        rows.map((r) =>
          r.id === target.id
            ? { ...r, published: data.published, values: data.values }
            : r,
        ),
      );
    }
  };

  return (
    <div className={embedded ? "" : "max-w-5xl"}>
      {/* Header */}
      {embedded ? (
        <div className="flex justify-end mb-3">
          <Button onClick={openNew} size="sm" className="gap-1.5">
            <Plus size={15} /> New {type.singular.toLowerCase()}
          </Button>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2.5">
              <type.icon size={22} className="text-primary" />
              {type.label}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {type.description}
            </p>
          </div>
          <Button onClick={openNew} className="gap-1.5 shrink-0">
            <Plus size={16} /> New {type.singular.toLowerCase()}
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-8" />
              <TableHead>{type.primaryLabel ?? type.singular}</TableHead>
              {type.secondaryField && (
                <TableHead className="hidden sm:table-cell">
                  {secondaryLabel}
                </TableHead>
              )}
              {primaryLocalized && (
                <TableHead className="hidden md:table-cell w-40">
                  Languages
                </TableHead>
              )}
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const locales = primaryLocalized
                ? filledLocales(row.values[type.primaryField])
                : [];
              return (
                <TableRow
                  key={row.id}
                  className="group cursor-pointer"
                  onClick={() => openEdit(row)}
                >
                  <TableCell className="text-muted-foreground/40">
                    <GripVertical
                      size={14}
                      className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <span className="group-hover:text-primary transition-colors line-clamp-1">
                      {displayValue(row.values[type.primaryField]) || (
                        <span className="text-muted-foreground italic">
                          Untitled
                        </span>
                      )}
                    </span>
                  </TableCell>
                  {type.secondaryField && (
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm line-clamp-1">
                      {displayValue(row.values[type.secondaryField])}
                    </TableCell>
                  )}
                  {primaryLocalized && (
                    <TableCell className="hidden md:table-cell">
                      <div className="flex gap-1">
                        {LOCALES.map((l) => {
                          const on = locales.includes(l.code);
                          return (
                            <span
                              key={l.code}
                              title={`${l.label}: ${on ? "translated" : "missing"}`}
                              className={cn(
                                "text-[9px] font-semibold px-1.5 py-0.5 rounded",
                                on
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground/50",
                              )}
                            >
                              {l.short}
                            </span>
                          );
                        })}
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    {row.published ? (
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 border-transparent">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(row);
                        }}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleting(row);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-sm text-muted-foreground py-10"
                >
                  No {type.label.toLowerCase()} yet.{" "}
                  <button onClick={openNew} className="text-primary underline">
                    Add one
                  </button>
                  .
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit / create drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          {target && (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 shrink-0">
                <div className="min-w-0">
                  <SheetTitle className="text-base font-semibold capitalize truncate">
                    {target === "new"
                      ? `New ${type.singular.toLowerCase()}`
                      : `Edit ${type.singular.toLowerCase()}`}
                  </SheetTitle>
                  <p className="text-xs text-muted-foreground">{type.label}</p>
                </div>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                  >
                    <X size={16} />
                  </Button>
                </SheetClose>
              </div>
              <div className="flex-1 min-h-0 flex flex-col">
                <ContentEditForm
                  type={type}
                  row={target === "new" ? undefined : target}
                  onDone={() => setOpen(false)}
                  embedded
                  onSubmit={onRowsChange ? handleItemSubmit : undefined}
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete confirmation */}
      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete {type.singular.toLowerCase()}?</DialogTitle>
            <DialogDescription>
              {deleting
                ? `"${displayValue(deleting.values[type.primaryField]) || "This item"}" will be permanently removed. This cannot be undone.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
