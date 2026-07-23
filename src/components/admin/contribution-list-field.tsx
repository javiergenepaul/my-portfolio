"use client";

import { Plus, X } from "lucide-react";
import { Button, Input, Textarea } from "@/components";
import type { ContributionItem, LocaleCode } from "./admin-config";

/**
 * Editor for a project's key contributions — a list of { name, description },
 * each localized. Only the given `locale` is edited here; switching the form's
 * locale tab edits that locale's copy while the list structure stays shared.
 */
export function ContributionListField({
  value,
  onChange,
  locale,
}: {
  value: ContributionItem[];
  onChange: (v: ContributionItem[]) => void;
  locale: LocaleCode;
}) {
  const add = () => onChange([...value, { name: {}, description: {} }]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const patch = (i: number, key: "name" | "description", v: string) =>
    onChange(
      value.map((item, idx) =>
        idx === i ? { ...item, [key]: { ...item[key], [locale]: v } } : item,
      ),
    );

  return (
    <div className="flex flex-col gap-2">
      {value.map((item, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-lg border border-border bg-background/40 p-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {i + 1}.
            </span>
            <Input
              value={item.name?.[locale] ?? ""}
              onChange={(e) => patch(i, "name", e.target.value)}
              placeholder="Contribution title"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => remove(i)}
              aria-label="Remove contribution"
            >
              <X size={15} />
            </Button>
          </div>
          <Textarea
            rows={2}
            value={item.description?.[locale] ?? ""}
            onChange={(e) => patch(i, "description", e.target.value)}
            placeholder="What you did / the impact"
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit gap-1.5"
        onClick={add}
      >
        <Plus size={14} /> Add contribution
      </Button>
    </div>
  );
}
