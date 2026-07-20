"use client";

import { Plus, X, Check } from "lucide-react";
import { Button, Input, Textarea } from "@/components";
import { cn } from "@/lib/utils";
import type { PromotionEntry, LocaleCode } from "./admin-config";

/**
 * Editor for an experience's promotion history — role changes within one job.
 * Each entry has localized title/subtitle/description (edited for the given
 * `locale`) plus shared dates + abbreviation. Mirrors how the row's own
 * start/end dates work: end can be a date or the literal "present".
 */
export function PromotionListField({
  value,
  onChange,
  locale,
}: {
  value: PromotionEntry[];
  onChange: (v: PromotionEntry[]) => void;
  locale: LocaleCode;
}) {
  const add = () =>
    onChange([
      ...value,
      { title: {}, subtitle: {}, description: {}, startYear: "", endYear: "" },
    ]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const patch = (i: number, patch: Partial<PromotionEntry>) =>
    onChange(value.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  const patchLocalized = (
    i: number,
    key: "title" | "subtitle" | "description",
    v: string,
  ) => patch(i, { [key]: { ...value[i][key], [locale]: v } });

  return (
    <div className="flex flex-col gap-2">
      {value.map((item, i) => {
        const present = item.endYear === "present";
        return (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-lg border border-border bg-background/40 p-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {i + 1}.
              </span>
              <Input
                value={item.title?.[locale] ?? ""}
                onChange={(e) => patchLocalized(i, "title", e.target.value)}
                placeholder="New title (e.g. Senior Engineer)"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => remove(i)}
                aria-label="Remove promotion"
              >
                <X size={15} />
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                value={item.subtitle?.[locale] ?? ""}
                onChange={(e) => patchLocalized(i, "subtitle", e.target.value)}
                placeholder="Team / department"
              />
              <Input
                className="w-32 shrink-0"
                value={item.abbreviation ?? ""}
                onChange={(e) => patch(i, { abbreviation: e.target.value })}
                placeholder="Abbrev."
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                Start
                <Input
                  type="date"
                  className="w-40"
                  value={item.startYear ?? ""}
                  onChange={(e) => patch(i, { startYear: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                End
                <Input
                  type="date"
                  className="w-40"
                  value={present ? "" : (item.endYear ?? "")}
                  disabled={present}
                  onChange={(e) => patch(i, { endYear: e.target.value })}
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  patch(i, { endYear: present ? "" : "present" })
                }
                className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-[5px] border transition-colors",
                    present
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-input bg-background",
                  )}
                >
                  {present && <Check size={11} strokeWidth={3} />}
                </span>
                Present
              </button>
            </div>

            <Textarea
              rows={2}
              value={item.description?.[locale] ?? ""}
              onChange={(e) => patchLocalized(i, "description", e.target.value)}
              placeholder="What changed / your remit in this role"
            />
          </div>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit gap-1.5"
        onClick={add}
      >
        <Plus size={14} /> Add promotion
      </Button>
    </div>
  );
}
