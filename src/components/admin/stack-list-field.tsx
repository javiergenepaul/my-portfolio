"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { createClient } from "@/lib/supabase/client";

/**
 * Ordered list of stack references, each chosen from a dropdown of the stacks
 * in the Skills table — so services/projects can't drift from a typo, and new
 * stacks you add show up here automatically. Stores an array of stack `name`
 * keys (the same shape as the old free-text list).
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
      setOptions(rows.map((r) => ({ name: r.name, label: r.label?.en || r.name })));
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const labelFor = (name: string) =>
    options.find((o) => o.name === name)?.label ?? name;

  const add = () => onChange([...value, ""]);
  const update = (i: number, v: string) =>
    onChange(value.map((x, idx) => (idx === i ? v : x)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-4 shrink-0 text-right text-xs text-muted-foreground/60">
            {i + 1}
          </span>
          <Select value={item || undefined} onValueChange={(v) => update(i, v)}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a stack">
                {item ? labelFor(item) : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.name} value={o.name}>
                  {o.label}
                  {o.label !== o.name && (
                    <span className="text-muted-foreground"> ({o.name})</span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit gap-1.5"
        onClick={add}
      >
        <Plus size={14} /> Add stack
      </Button>
    </div>
  );
}
