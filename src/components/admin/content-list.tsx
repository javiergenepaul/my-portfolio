"use client";

import { useRef, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Plus, Pencil, GripVertical, X, Trash2, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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

/**
 * One row of the list, draggable by its grip.
 *
 * Drag is handle-driven (`dragListener={false}`) because the row itself is a
 * click-to-edit target — a whole-row drag listener would swallow that click.
 * The grip also takes ArrowUp/ArrowDown so the list can be reordered without a
 * pointer; React keys the row by id, so the focused handle travels with it.
 */
function ContentRowItem({
  row,
  index,
  type,
  primaryLocalized,
  canReorder,
  onEdit,
  onDelete,
  onMove,
}: {
  row: ContentRow;
  index: number;
  type: ContentTypeDef;
  primaryLocalized: boolean;
  canReorder: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const controls = useDragControls();
  const locales = primaryLocalized
    ? filledLocales(row.values[type.primaryField])
    : [];
  const name = displayValue(row.values[type.primaryField]) || "Untitled";

  return (
    <Reorder.Item
      as="tr"
      value={row.id}
      dragListener={false}
      dragControls={controls}
      className="group cursor-pointer border-b transition-colors hover:bg-muted/50"
      onClick={onEdit}
    >
      <TableCell className="text-muted-foreground/40">
        <button
          type="button"
          disabled={!canReorder}
          title={
            canReorder ? undefined : "Clear the search to reorder this list"
          }
          aria-label={`Reorder ${name} (position ${index + 1}) — use arrow up and down`}
          onPointerDown={(e) => canReorder && controls.start(e)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              onMove(-1);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              onMove(1);
            }
          }}
          className={cn(
            "touch-none opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100",
            canReorder
              ? "cursor-grab hover:text-foreground active:cursor-grabbing"
              : "cursor-not-allowed",
          )}
        >
          <GripVertical size={14} />
        </button>
      </TableCell>
      <TableCell className="font-medium">
        <span className="group-hover:text-primary transition-colors line-clamp-1">
          {displayValue(row.values[type.primaryField]) || (
            <span className="text-muted-foreground italic">Untitled</span>
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
              onEdit();
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
              onDelete();
            }}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </TableCell>
    </Reorder.Item>
  );
}

/** Lists shorter than this don't get a search box — it'd be noise. */
const SEARCH_THRESHOLD = 8;

/**
 * Flattens a field value to searchable text. Unlike `displayValue`, this spans
 * *every* locale, so searching "Cebuano" copy finds the row even while the list
 * is rendering English.
 */
function searchText(value: FieldValue | undefined): string {
  if (value == null || typeof value === "boolean") return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string").join(" ");
  }
  return Object.values(value)
    .map((cell) => (Array.isArray(cell) ? cell.join(" ") : (cell ?? "")))
    .join(" ");
}

/** Which locales have a non-empty value for a localized field. */
function filledLocales(value: FieldValue | undefined): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return LOCALES.filter((l) => {
    const cell = value[l.code];
    return Array.isArray(cell)
      ? cell.length > 0
      : (cell ?? "").trim().length > 0;
  }).map((l) => l.code);
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
  const [query, setQuery] = useState("");
  const [confirmClose, setConfirmClose] = useState(false);
  // A ref, not state: `requestClose` reads it during the same click that closes
  // the drawer, before a state update would have landed.
  const formDirtyRef = useRef(false);

  const closeDrawer = () => {
    formDirtyRef.current = false;
    setConfirmClose(false);
    setOpen(false);
  };
  /** Every drawer exit (Cancel, X, Esc, overlay) funnels through here. */
  const requestClose = () => {
    if (formDirtyRef.current) setConfirmClose(true);
    else closeDrawer();
  };

  const q = query.trim().toLowerCase();
  const visibleRows = q
    ? rows.filter((r) =>
        [type.primaryField, type.secondaryField]
          .filter((f): f is string => !!f)
          .some((f) => searchText(r.values[f]).toLowerCase().includes(q)),
      )
    : rows;
  // Reordering is a whole-list operation, so it's disabled while a filter is
  // active — dropping a row "above" another is meaningless when the rows
  // between them are hidden, and it would silently reshuffle the rest.
  const canReorder = !!onRowsChange && !q;

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
    }
    setDeleting(null);
  };

  // Drag-to-reorder. Array position is the persisted order — replaceContentRows
  // writes sort_order from the index — so reordering is just a reshuffle of the
  // draft list; `row.order` is read-only and deliberately left alone.
  const handleReorder = (ids: string[]) => {
    if (!onRowsChange || !canReorder) return;
    const byId = new Map(rows.map((r) => [r.id, r]));
    const next = ids
      .map((id) => byId.get(id))
      .filter((r): r is ContentRow => !!r);
    if (next.length === rows.length) onRowsChange(next);
  };

  /** Keyboard equivalent of a drag — dragging alone isn't pointer-free. */
  const move = (from: number, to: number) => {
    if (!onRowsChange || !canReorder || to < 0 || to >= rows.length) return;
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onRowsChange(next);
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

      {/* Search — only once a list is long enough for scanning to be a chore. */}
      {rows.length >= SEARCH_THRESHOLD && (
        <div className="relative mb-3">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${type.label.toLowerCase()}…`}
            aria-label={`Search ${type.label.toLowerCase()}`}
            className="pl-9 pr-20"
          />
          {q && (
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <span className="text-xs tabular-nums text-muted-foreground">
                {visibleRows.length}/{rows.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X size={13} />
              </Button>
            </div>
          )}
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
          {visibleRows.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-sm text-muted-foreground py-10"
                >
                  {q ? (
                    <>
                      No {type.label.toLowerCase()} match &ldquo;{query.trim()}
                      &rdquo;.{" "}
                      <button
                        onClick={() => setQuery("")}
                        className="text-primary underline"
                      >
                        Clear search
                      </button>
                      .
                    </>
                  ) : (
                    <>
                      No {type.label.toLowerCase()} yet.{" "}
                      <button
                        onClick={openNew}
                        className="text-primary underline"
                      >
                        Add one
                      </button>
                      .
                    </>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <Reorder.Group
              as="tbody"
              axis="y"
              values={visibleRows.map((r) => r.id)}
              onReorder={handleReorder}
              className="[&_tr:last-child]:border-0"
            >
              {visibleRows.map((row, i) => (
                <ContentRowItem
                  key={row.id}
                  row={row}
                  index={i}
                  type={type}
                  primaryLocalized={!!primaryLocalized}
                  canReorder={canReorder}
                  onEdit={() => openEdit(row)}
                  onDelete={() => setDeleting(row)}
                  onMove={(dir) => move(i, i + dir)}
                />
              ))}
            </Reorder.Group>
          )}
        </Table>
      </div>

      {/* Edit / create drawer */}
      <Sheet
        open={open}
        onOpenChange={(o) => (o ? setOpen(true) : requestClose())}
      >
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
                  onDone={requestClose}
                  embedded
                  onSubmit={onRowsChange ? handleItemSubmit : undefined}
                  onDirtyChange={(d) => {
                    formDirtyRef.current = d;
                  }}
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Discard confirmation — closing the drawer with unsaved field edits */}
      <Dialog
        open={confirmClose}
        onOpenChange={(o) => !o && setConfirmClose(false)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Discard unsaved changes?</DialogTitle>
            <DialogDescription>
              This {type.singular.toLowerCase()} has edits that haven&apos;t
              been applied yet. Closing will lose them.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setConfirmClose(false)}>
              Keep editing
            </Button>
            <Button variant="destructive" onClick={closeDrawer}>
              Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
