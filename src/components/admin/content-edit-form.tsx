"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Trash2,
  Globe,
  Check,
  Plus,
  X,
  Loader2,
  Star,
  StarHalf,
} from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "@/components";
import { cn } from "@/lib/utils";
import {
  type ContentTypeDef,
  type ContentRow,
  type FieldDef,
  type FieldValue,
  type LocalizedValue,
  type LocaleCode,
  type LinkItem,
  LOCALES,
} from "./admin-config";
import {
  SOCIAL_PLATFORMS,
  getPlatform,
} from "@/components/testimonial/social-platforms";
import { saveContentRow, deleteContentRow } from "@/lib/content/actions";
import { ImageUploadField } from "./image-upload-field";
import { MockupTemplateField } from "./mockup-template-field";
import { StackListField } from "./stack-list-field";

function blankValues(type: ContentTypeDef): Record<string, FieldValue> {
  const v: Record<string, FieldValue> = {};
  for (const f of type.fields) {
    v[f.name] = f.localized
      ? {}
      : f.type === "string-list" ||
          f.type === "stack-list" ||
          f.type === "link-list"
        ? []
        : "";
  }
  return v;
}

export function ContentEditForm({
  type,
  row,
  /** Called after save/delete/cancel (drawer & modal use it to close). */
  onDone,
  /** Renders the compact layout (scroll body + sticky footer) for drawers/modals. */
  embedded = false,
  /** Draft mode: report edited data to the parent instead of a "saved" toast. */
  onSubmit,
}: {
  type: ContentTypeDef;
  row?: ContentRow;
  onDone?: () => void;
  embedded?: boolean;
  onSubmit?: (row: {
    id?: string;
    published: boolean;
    values: Record<string, FieldValue>;
  }) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const isNew = !row;

  const [values, setValues] = useState<Record<string, FieldValue>>(
    row ? structuredClone(row.values) : blankValues(type),
  );
  const [published, setPublished] = useState(row?.published ?? false);
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [busy, setBusy] = useState(false);

  const hasLocalized = type.fields.some((f) => f.localized);

  const setPlain = (name: string, val: FieldValue) =>
    setValues((p) => ({ ...p, [name]: val }));
  const setLocalized = (name: string, code: LocaleCode, val: string) =>
    setValues((p) => ({
      ...p,
      [name]: { ...((p[name] as LocalizedValue) ?? {}), [code]: val },
    }));

  const finish = () => {
    if (onDone) onDone();
    else if (!type.singleton) router.push(`/admin/${type.key}`);
  };

  const onSave = async () => {
    if (onSubmit) {
      // Draft mode — hand the data up; the parent persists on its own Save.
      onSubmit({ id: row?.id, published, values });
      finish();
      return;
    }
    // Standalone mode (singleton / deep-link edit) — persist directly.
    setBusy(true);
    try {
      await saveContentRow({ type: type.key, id: row?.id, published, values });
      toast({
        title: isNew ? "Created" : "Saved",
        description: "Your changes are live in the database.",
        duration: 3000,
      });
      router.refresh();
      finish();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: e instanceof Error ? e.message : "Unknown error",
        duration: 8000,
      });
    } finally {
      setBusy(false);
    }
  };
  const onDelete = async () => {
    if (!row) return;
    setBusy(true);
    try {
      await deleteContentRow(type.key, row.id);
      toast({
        variant: "destructive",
        title: "Deleted",
        description: `${type.singular} removed from the database.`,
        duration: 3000,
      });
      router.refresh();
      finish();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: e instanceof Error ? e.message : "Unknown error",
        duration: 8000,
      });
      setBusy(false);
    }
  };

  const title = type.singleton
    ? `Edit ${type.singular}`
    : isNew
      ? `New ${type.singular.toLowerCase()}`
      : `Edit ${type.singular.toLowerCase()}`;

  // Shared body: published toggle + locale tabs + fields.
  const formBody = (
    <div className="flex flex-col gap-5">
      {!type.singleton && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
          <div>
            <p className="text-sm font-medium">Published</p>
            <p className="text-xs text-muted-foreground">
              {published ? "Visible on the live site." : "Hidden as a draft."}
            </p>
          </div>
          <Switch checked={published} onCheckedChange={setPublished} />
        </div>
      )}

      {hasLocalized && (
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-muted-foreground shrink-0" />
          <div className="flex flex-wrap gap-1">
            {LOCALES.map((l) => {
              const on = locale === l.code;
              const filled = coverageForLocale(type, values, l.code);
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLocale(l.code)}
                  className={cn(
                    "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-colors",
                    on
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l.label}
                  {filled && (
                    <Check
                      size={11}
                      className={on ? "text-primary" : "text-emerald-500"}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 sm:p-6">
        {type.fields.map((field) =>
          field.showIf && !field.showIf(values) ? null : (
            <FieldRow
              key={field.name}
              field={field}
              locale={locale}
              value={values[field.name]}
              record={values}
              onPlain={(v) => setPlain(field.name, v)}
              onLocalized={(v) => setLocalized(field.name, locale, v)}
            />
          ),
        )}
      </div>
    </div>
  );

  // ── Embedded (drawer) layout: scroll body + sticky footer ─────────────
  if (embedded) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">{formBody}</div>
        <div className="shrink-0 border-t border-border bg-card/40 p-4 flex items-center gap-2">
          {!isNew && !type.singleton && !onSubmit && (
            <Button
              variant="ghost"
              onClick={() => void onDelete()}
              disabled={busy}
              className="gap-1.5 text-muted-foreground hover:text-destructive"
            >
              <Trash2 size={15} /> Delete
            </Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={finish} disabled={busy}>
              Cancel
            </Button>
            <Button
              onClick={() => void onSave()}
              disabled={busy}
              className="gap-1.5"
            >
              {onSubmit ? (
                "Done"
              ) : busy ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save size={15} /> Save
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Standalone page layout (singletons / deep links) ──────────────────
  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          {!type.singleton && (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
            >
              <Link href={`/admin/${type.key}`}>
                <ArrowLeft size={16} />
              </Link>
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-semibold capitalize truncate">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground">{type.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isNew && !type.singleton && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-destructive"
              onClick={() => void onDelete()}
              disabled={busy}
              title="Delete"
            >
              <Trash2 size={16} />
            </Button>
          )}
          <Button
            onClick={() => void onSave()}
            disabled={busy}
            className="gap-1.5"
          >
            {busy ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {busy ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
      {formBody}
    </div>
  );
}

function coverageForLocale(
  type: ContentTypeDef,
  values: Record<string, FieldValue>,
  code: LocaleCode,
): boolean {
  const localizedFields = type.fields.filter((f) => f.localized);
  if (localizedFields.length === 0) return false;
  return localizedFields.every((f) => {
    const v = values[f.name] as LocalizedValue | undefined;
    return (v?.[code] ?? "").trim().length > 0;
  });
}

function FieldRow({
  field,
  locale,
  value,
  record,
  onPlain,
  onLocalized,
}: {
  field: FieldDef;
  locale: LocaleCode;
  value: FieldValue | undefined;
  record?: Record<string, FieldValue>;
  onPlain: (v: FieldValue) => void;
  onLocalized: (v: string) => void;
}) {
  const localizedVal =
    field.localized && value && typeof value === "object"
      ? ((value as LocalizedValue)[locale] ?? "")
      : "";
  const plainVal = typeof value === "string" ? value : "";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Label htmlFor={field.name}>{field.label}</Label>
        {field.localized && (
          <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground bg-muted rounded px-1.5 py-0.5">
            {locale}
          </span>
        )}
      </div>

      {field.type === "textarea" && (
        <Textarea
          id={field.name}
          rows={4}
          placeholder={field.placeholder}
          value={field.localized ? localizedVal : plainVal}
          onChange={(e) =>
            field.localized
              ? onLocalized(e.target.value)
              : onPlain(e.target.value)
          }
        />
      )}

      {(field.type === "text" ||
        field.type === "url" ||
        field.type === "date" ||
        field.type === "number") && (
        <Input
          id={field.name}
          type={
            field.type === "url"
              ? "url"
              : field.type === "date"
                ? "date"
                : field.type === "number"
                  ? "number"
                  : "text"
          }
          placeholder={field.placeholder}
          value={field.localized ? localizedVal : plainVal}
          onChange={(e) =>
            field.localized
              ? onLocalized(e.target.value)
              : onPlain(e.target.value)
          }
        />
      )}

      {field.type === "rating" && (
        <RatingField
          value={plainVal}
          onChange={(v) => onPlain(v)}
          max={field.max ?? 5}
          half={field.half}
        />
      )}

      {field.type === "date-present" && (
        <DatePresentField value={plainVal} onChange={(v) => onPlain(v)} />
      )}

      {field.type === "string-list" && (
        <StringListField
          value={
            Array.isArray(value)
              ? value.filter((x): x is string => typeof x === "string")
              : []
          }
          onChange={(v) => onPlain(v)}
          placeholder={field.placeholder}
          multiline={field.multiline}
        />
      )}

      {field.type === "stack-list" && (
        <StackListField
          value={
            Array.isArray(value)
              ? value.filter((x): x is string => typeof x === "string")
              : []
          }
          onChange={(v) => onPlain(v)}
        />
      )}

      {field.type === "link-list" && (
        <LinkListField
          value={
            Array.isArray(value)
              ? (value.filter(
                  (x): x is LinkItem => typeof x === "object",
                ) as LinkItem[])
              : []
          }
          onChange={(v) => onPlain(v)}
        />
      )}

      {field.type === "boolean" && (
        <div className="pt-1">
          <Switch
            checked={value === true}
            onCheckedChange={(c) => onPlain(c)}
          />
        </div>
      )}

      {field.type === "select" && (
        <Select value={plainVal} onValueChange={(v) => onPlain(v)}>
          <SelectTrigger id={field.name}>
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === "image" && (
        <ImageUploadField
          value={plainVal}
          onChange={(v) => onPlain(v)}
          pathPrefix={field.name}
        />
      )}

      {field.type === "mockup-template" && (
        <MockupTemplateField
          value={plainVal}
          onChange={(v) => onPlain(v)}
          screenshot={
            typeof record?.mockPhoto === "string" ? record.mockPhoto : undefined
          }
        />
      )}

      {field.help && (
        <p className="text-[11px] text-muted-foreground">{field.help}</p>
      )}
    </div>
  );
}

/**
 * Star rating constrained to `max` stars, so the value can never exceed it.
 * With `half`, each star has left/right halves for 0.5 steps (e.g. 4.5).
 * Stores the number as a string (empty when cleared).
 */
function RatingField({
  value,
  onChange,
  max = 5,
  half = false,
}: {
  value: string;
  onChange: (v: string) => void;
  max?: number;
  half?: boolean;
}) {
  const current = value === "" ? 0 : Number(value);
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? current;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center" onMouseLeave={() => setHover(null)}>
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
          const level =
            shown >= star
              ? "full"
              : half && shown >= star - 0.5
                ? "half"
                : "empty";
          return (
            <span
              key={star}
              className="relative inline-flex h-7 w-7 items-center justify-center"
            >
              <span
                className={cn(
                  "pointer-events-none",
                  level === "empty"
                    ? "text-muted-foreground/35"
                    : "text-amber-400",
                )}
              >
                {level === "half" ? (
                  <StarHalf size={22} className="fill-current" />
                ) : (
                  <Star
                    size={22}
                    className={level === "full" ? "fill-current" : ""}
                  />
                )}
              </span>
              {half && (
                <button
                  type="button"
                  aria-label={`${star - 0.5} of ${max}`}
                  className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
                  onMouseEnter={() => setHover(star - 0.5)}
                  onClick={() => onChange(String(star - 0.5))}
                />
              )}
              <button
                type="button"
                aria-label={`${star} of ${max}`}
                className={cn(
                  "absolute inset-y-0 cursor-pointer",
                  half ? "right-0 w-1/2" : "inset-x-0",
                )}
                onMouseEnter={() => setHover(star)}
                onClick={() => onChange(String(star))}
              />
            </span>
          );
        })}
      </div>
      <span className="text-sm tabular-nums text-muted-foreground">
        {current ? current : "—"}
        <span className="text-muted-foreground/50">/{max}</span>
      </span>
      {current > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-muted-foreground hover:text-destructive"
        >
          Clear
        </button>
      )}
    </div>
  );
}

/**
 * Date picker + "Present" checkbox (LinkedIn-style). Stores either an ISO date
 * string or the literal "present". Remembers the last picked date so toggling
 * Present off restores it.
 */
function DatePresentField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const isPresent = value === "present";
  const [lastDate, setLastDate] = useState(isPresent ? "" : value);

  const togglePresent = () => {
    if (isPresent) onChange(lastDate);
    else onChange("present");
  };

  return (
    <div className="flex flex-col gap-2">
      {isPresent ? (
        <Input value="Present" disabled />
      ) : (
        <Input
          type="date"
          value={value}
          onChange={(e) => {
            setLastDate(e.target.value);
            onChange(e.target.value);
          }}
        />
      )}

      <button
        type="button"
        onClick={togglePresent}
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <span
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-[5px] border transition-colors",
            isPresent
              ? "bg-primary border-primary text-primary-foreground"
              : "border-input bg-background",
          )}
        >
          {isPresent && <Check size={11} strokeWidth={3} />}
        </span>
        Currently ongoing (Present)
      </button>
    </div>
  );
}

/** Add-any-number list of plain strings (résumé bullets, skills, tags). */
function StringListField({
  value,
  onChange,
  placeholder,
  multiline,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const add = () => onChange([...value, ""]);
  const update = (i: number, v: string) =>
    onChange(value.map((x, idx) => (idx === i ? v : x)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="w-4 shrink-0 text-right text-xs text-muted-foreground/60 mt-2.5">
            {i + 1}
          </span>
          {multiline ? (
            <Textarea
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              rows={2}
              className="resize-y min-h-0"
            />
          ) : (
            <Input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
            />
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive mt-0.5"
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
        <Plus size={14} /> Add
      </Button>
    </div>
  );
}

/** Add-any-number list of { platform, url } links (pick platform + URL). */
function LinkListField({
  value,
  onChange,
}: {
  value: LinkItem[];
  onChange: (v: LinkItem[]) => void;
}) {
  const add = () => onChange([...value, { platform: "github", url: "" }]);
  const update = (i: number, patch: Partial<LinkItem>) =>
    onChange(value.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-2">
      {value.map((item, i) => {
        const plat = getPlatform(item.platform);
        return (
          <div key={i} className="flex items-center gap-2">
            <Select
              value={item.platform}
              onValueChange={(v) => update(i, { platform: v })}
            >
              <SelectTrigger className="w-36 shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOCIAL_PLATFORMS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <span className="flex items-center gap-2">
                      <p.icon size={14} /> {p.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="url"
              value={item.url}
              onChange={(e) => update(i, { url: e.target.value })}
              placeholder={plat?.placeholder ?? "https://…"}
            />
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
        onClick={add}
      >
        <Plus size={14} /> Add link
      </Button>
    </div>
  );
}
