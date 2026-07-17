"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components";
import { createClient } from "@/lib/supabase/client";

/**
 * Ordered list of stack references, each chosen from a dropdown of the stacks
 * in the Skills table — so services/projects can't drift from a typo, and new
 * stacks you add show up here automatically. Stores an array of stack `name`
 * keys (the same shape as the old free-text list).
 *
 * Uses a native <select> on purpose: the Radix Select's portal reconciles badly
 * against a dynamic list under React 19 (a "removeChild" crash on select). A
 * native control has no portal, so it's structurally immune. Already-picked
 * stacks are shown disabled, so you can't add a duplicate.
 */

type StackOption = { name: string; label: string };

export function StackListField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [options, setOptions] = useState<StackOption[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      // Prefer name + localized label; fall back to name-only if the label
      // column isn't there yet (pre-0014), so the picker still works.
      const primary = await supabase
        .from("skills")
        .select("name, label")
        .order("sort_order", { ascending: true });
      const data = primary.error
        ? (
            await supabase
              .from("skills")
              .select("name")
              .order("sort_order", { ascending: true })
          ).data
        : primary.data;
      if (cancelled) return;
      const rows = (data ?? []) as unknown as {
        name: string;
        label?: { en?: string } | null;
      }[];
      setOptions(
        rows.map((r) => ({ name: r.name, label: r.label?.en || r.name })),
      );
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const add = () => onChange([...value, ""]);
  const update = (i: number, v: string) =>
    onChange(value.map((x, idx) => (idx === i ? v : x)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2">
      {value.map((item, i) => {
        // Already chosen in another row → disabled here, so no duplicates.
        const takenElsewhere = new Set(value.filter((_, idx) => idx !== i));
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="w-4 shrink-0 text-right text-xs text-muted-foreground/60">
              {i + 1}
            </span>
            <select
              value={item}
              onChange={(e) => update(i, e.target.value)}
              className="flex h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:ring-1 focus:ring-ring"
            >
              <option value="" disabled>
                Select a stack…
              </option>
              {options.map((o) => (
                <option
                  key={o.name}
                  value={o.name}
                  disabled={takenElsewhere.has(o.name)}
                >
                  {o.label}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => remove(i)}
              aria-label="Remove"
            >
              <X size={15} />
            </Button>
          </div>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit gap-1.5"
        disabled={value.filter(Boolean).length >= options.length}
        onClick={add}
      >
        <Plus size={14} /> Add stack
      </Button>
    </div>
  );
}
