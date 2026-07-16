"use client";

import Link from "next/link";
import { ArrowRight, Pencil, FileText } from "lucide-react";
import { CONTENT_TYPES, type ContentTypeDef } from "./admin-config";
import { useAdminAuth } from "./admin-auth";
import type { TypeCount } from "@/lib/content/repository";

// Resume leads, then the rest of the content — matches the admin nav order.
const GROUPS = ["Resume", "Content"];

const EMPTY: TypeCount = { total: 0, published: 0 };

export function Dashboard({
  /** Per-type row counts fetched server-side, keyed by content-type key. */
  counts,
}: {
  counts: Record<string, TypeCount>;
}) {
  const { user } = useAdminAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const totalItems = CONTENT_TYPES.reduce(
    (n, t) => n + (counts[t.key]?.total ?? 0),
    0,
  );

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Welcome back, {firstName}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {CONTENT_TYPES.length} content types · {totalItems} items across your
          portfolio.
        </p>
      </div>

      {GROUPS.map((group) => {
        const items = CONTENT_TYPES.filter(
          (t) => (t.group ?? "Content") === group,
        );
        if (items.length === 0) return null;
        return (
          <section key={group} className="mb-8 last:mb-0">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {group}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group === "Resume" ? (
                <ResumeCard count={items.length} />
              ) : (
                items.map((t) => (
                  <TypeCard
                    key={t.key}
                    type={t}
                    count={counts[t.key] ?? EMPTY}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ResumeCard({ count }: { count: number }) {
  return (
    <Link
      href="/admin/resume"
      className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
          <FileText size={18} />
        </div>
        <ArrowRight
          size={16}
          className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
        />
      </div>
      <div>
        <h3 className="font-semibold text-sm">Resume</h3>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          Edit sections and preview the layouts.
        </p>
      </div>
      <div className="text-xs text-muted-foreground mt-auto pt-1">
        {count} sections · ATS &amp; Modern preview
      </div>
    </Link>
  );
}

function TypeCard({
  type: t,
  count,
}: {
  type: ContentTypeDef;
  count: TypeCount;
}) {
  const { total, published } = count;
  const drafts = total - published;

  return (
    <Link
      href={`/admin/${t.key}`}
      className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
          <t.icon size={18} />
        </div>
        <ArrowRight
          size={16}
          className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
        />
      </div>
      <div>
        <h3 className="font-semibold text-sm flex items-center gap-2">
          {t.label}
          {t.singleton && (
            <span className="text-[10px] font-normal text-muted-foreground border border-border rounded px-1.5 py-0.5">
              single
            </span>
          )}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          {t.description}
        </p>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-1">
        {t.singleton ? (
          <span className="inline-flex items-center gap-1">
            <Pencil size={11} /> Edit
          </span>
        ) : (
          <>
            <span>
              <b className="text-foreground">{published}</b> published
            </span>
            {drafts > 0 && (
              <span>
                <b className="text-foreground">{drafts}</b> draft
                {drafts > 1 ? "s" : ""}
              </span>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
