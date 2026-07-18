"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Image as ImageIcon, Plus, X } from "lucide-react";
import { Button } from "@/components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/ui/dialog";
import { MockupFrame } from "@/components/mockup/mockup-frame";
import { getMockupTemplate } from "@/lib/mockups/templates";
import { resolveMockupScreenshot } from "@/lib/mockups/resolve-mockup-asset";
import type { MockupItem } from "./admin-config";
import { ImageUploadField } from "./image-upload-field";
import { TemplateGalleryDialog } from "./template-gallery-dialog";

const ADD = "__add__";

function newItem(template: string): MockupItem {
  return { id: crypto.randomUUID(), template, screenshot: "" };
}

function MockupRow({
  item,
  index,
  onOpen,
  onRemove,
}: {
  item: MockupItem;
  index: number;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const controls = useDragControls();
  const tpl = getMockupTemplate(item.template);
  return (
    <Reorder.Item
      as="div"
      value={item.id}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-2"
    >
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        className="shrink-0 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical size={16} />
      </button>

      {/* Thumbnail — click to preview / edit */}
      <button
        type="button"
        onClick={onOpen}
        className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted"
        aria-label="Preview mockup"
      >
        {item.screenshot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveMockupScreenshot(item.screenshot)}
            alt=""
            className="h-full w-full object-cover object-top"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageIcon size={16} />
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 text-left"
      >
        <div className="truncate text-sm font-medium">
          {index + 1}. {tpl?.label ?? "No frame"}
        </div>
        <div className="text-xs text-muted-foreground">
          {item.screenshot
            ? "Screenshot set · click to preview"
            : "No screenshot · click to add"}
        </div>
      </button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={onRemove}
        aria-label="Remove mockup"
      >
        <X size={15} />
      </Button>
    </Reorder.Item>
  );
}

/**
 * Draggable list of a project's mockups. Compact rows (thumbnail + label);
 * clicking a row opens a preview/edit modal (large composite + screenshot
 * upload + change frame). "Add mockup" opens the template gallery first, then
 * the new item's editor. Array order is the carousel sequence on the card.
 */
export function MockupListField({
  value,
  onChange,
}: {
  value: MockupItem[];
  onChange: (v: MockupItem[]) => void;
}) {
  // Guarantee a stable id on every item (back-filled/legacy rows may lack one).
  const items = value.map((it, i) => (it.id ? it : { ...it, id: `mockup-${i}` }));
  const [editingId, setEditingId] = useState<string | null>(null);
  // null = closed; ADD = adding a new mockup; otherwise the item id whose frame
  // is being changed.
  const [galleryFor, setGalleryFor] = useState<string | null>(null);

  const editing = items.find((it) => it.id === editingId) ?? null;
  const galleryItem =
    galleryFor && galleryFor !== ADD
      ? (items.find((it) => it.id === galleryFor) ?? null)
      : null;

  const reorder = (ids: string[]) => {
    const byId = new Map(items.map((it) => [it.id, it]));
    onChange(ids.map((id) => byId.get(id)).filter(Boolean) as MockupItem[]);
  };
  const update = (id: string, patch: Partial<MockupItem>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const remove = (id: string) => onChange(items.filter((it) => it.id !== id));

  const onPickTemplate = (templateId: string) => {
    if (galleryFor === ADD) {
      const it = newItem(templateId);
      onChange([...items, it]);
      setEditingId(it.id); // jump straight into the new item's editor
    } else if (galleryFor) {
      update(galleryFor, { template: templateId });
    }
    setGalleryFor(null);
  };

  return (
    <div className="flex flex-col gap-3">
      {items.length > 0 && (
        <Reorder.Group
          as="div"
          axis="y"
          values={items.map((it) => it.id)}
          onReorder={reorder}
          className="flex flex-col gap-2"
        >
          {items.map((it, i) => (
            <MockupRow
              key={it.id}
              item={it}
              index={i}
              onOpen={() => setEditingId(it.id)}
              onRemove={() => remove(it.id)}
            />
          ))}
        </Reorder.Group>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit gap-1.5"
        onClick={() => setGalleryFor(ADD)}
      >
        <Plus size={14} /> Add mockup
      </Button>

      {/* Preview / edit modal for a single mockup */}
      <Dialog
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditingId(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Mockup
              {editing
                ? ` — ${getMockupTemplate(editing.template)?.label ?? "no frame"}`
                : ""}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="flex min-w-0 flex-col gap-4">
              <div className="mx-auto w-full max-w-md">
                {!editing.screenshot ? (
                  <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    Upload a screenshot to preview
                  </div>
                ) : editing.template ? (
                  <MockupFrame
                    templateId={editing.template}
                    screenshot={resolveMockupScreenshot(editing.screenshot)}
                    alt="Mockup preview"
                  />
                ) : (
                  // No frame — show the raw screenshot.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveMockupScreenshot(editing.screenshot)}
                    alt="Mockup preview"
                    className="w-full rounded-lg"
                  />
                )}
              </div>

              <ImageUploadField
                value={editing.screenshot}
                onChange={(v) => update(editing.id, { screenshot: v })}
                pathPrefix="mockups"
              />

              <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">
                  Frame:{" "}
                  <span className="font-medium text-foreground">
                    {getMockupTemplate(editing.template)?.label ?? "None"}
                  </span>
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setGalleryFor(editing.id)}
                >
                  Change frame
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Template gallery — used for both "Add mockup" and "Change frame" */}
      <TemplateGalleryDialog
        open={!!galleryFor}
        onOpenChange={(o) => {
          if (!o) setGalleryFor(null);
        }}
        value={galleryItem?.template}
        screenshot={resolveMockupScreenshot(galleryItem?.screenshot)}
        onSelect={onPickTemplate}
      />
    </div>
  );
}
