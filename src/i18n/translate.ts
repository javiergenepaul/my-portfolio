import { messageStore } from "./store";
import { en } from "./locale";

/**
 * Builds valid key-paths for the translation object.
 * Stays based on the English locale as the canonical source of truth.
 */
type DefaultLocale = typeof en;
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>;
type RecursiveKeyOf<TObj extends Record<string, any>> = {
  [TKey in keyof TObj & string]: TObj[TKey] extends Record<string, any>
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & string];

/** Traverse a nested object by a dot-separated path. */
function getNestedValue(obj: Record<string, any>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

/**
 * Replaces `{{key}}` placeholders in a template string.
 * Matches the ICU subset used by the existing translation files.
 */
function interpolate(template: string, params?: Record<string, any>): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    String(params[key] ?? `{{${key}}}`)
  );
}

/**
 * Synchronous translation helper.
 *
 * Can be called at module scope or inside components — it always reads from
 * the `messageStore` singleton which `I18nProvider` keeps in sync.
 *
 * @param key  Dot-separated translation key (type-checked against en.json).
 * @param options  Optional interpolation values, e.g. `{ count: 5 }`.
 */
export function translate(key: TxKeyPath, options?: Record<string, any>): string {
  if (!key) return "";
  const msg = getNestedValue(messageStore.messages, key);
  if (typeof msg !== "string") return key;
  return interpolate(msg, options);
}
