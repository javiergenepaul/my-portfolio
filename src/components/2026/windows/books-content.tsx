"use client";

import { BookOpen, Quote } from "lucide-react";
import { BOOKS } from "@/config";
import { translate, useLocaleRefresh } from "@/i18n";

export function BooksContent() {
  useLocaleRefresh();

  const bookIds = [
    "startWithWhy",
    "egoIsTheEnemy",
    "atomicHabits",
    "doHardThings",
    "theObstacleIsTheWay",
    "stillnessIsTheKey",
    "leadersEatLast",
  ] as const;

  return (
    <div className="font-mac flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="flex items-center shrink-0 border-b bg-a26-title-bar border-a26-glass-border gap-2 py-2 px-3.5">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-[8px]"
          style={{
            background:
              "color-mix(in srgb, #F97316 14%, transparent)",
            border:
              "1px solid color-mix(in srgb, #F97316 26%, transparent)",
          }}
        >
          <BookOpen size={14} color="#F97316" />
        </div>
        <div>
          <div className="text-a26-text text-[13px] font-semibold">
            {translate("win26.books.title")}
          </div>
          <div className="text-a26-mid text-[11px]">
            {translate("win26.books.subtitle")}
          </div>
        </div>
      </div>

      <div
        className="win26-scroll flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin]"
        style={{ scrollbarColor: "rgba(255,255,255,0.18) transparent" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BOOKS.map((book, index) => {
            const bookId = bookIds[index];
            const title =
              translate(`win26.books.items.${bookId}.title` as any) ||
              book.title;
            const author =
              translate(`win26.books.items.${bookId}.author` as any) ||
              book.author;
            const theme =
              translate(`win26.books.items.${bookId}.theme` as any) ||
              book.theme;
            const quote =
              translate(`win26.books.items.${bookId}.quote` as any) ||
              book.quote;
            const reflection =
              translate(`win26.books.items.${bookId}.reflection` as any) ||
              book.reflection;

            return <article
              key={bookId}
              className="bg-a26-card border border-a26-card-border rounded-xl p-4 flex flex-col gap-3"
              style={{
                boxShadow: "0 10px 28px rgba(0,0,0,0.18)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-a26-text text-[14px] font-semibold leading-[1.4] m-0">
                    {title}
                  </h2>
                  <p className="text-a26-mid text-[11px] mt-1 mb-0">
                    {author}
                  </p>
                </div>
                <span
                  className="shrink-0 text-[10px] font-semibold rounded-full px-2.5 py-1"
                  style={{
                    background:
                      "color-mix(in srgb, #F97316 12%, transparent)",
                    border:
                      "1px solid color-mix(in srgb, #F97316 22%, transparent)",
                    color: "#FDBA74",
                  }}
                >
                  {theme}
                </span>
              </div>

              <div
                className="rounded-lg px-3 py-2.5"
                style={{
                  background: "color-mix(in srgb, var(--a26-glass) 78%, transparent)",
                  border: "1px solid var(--a26-glass-border)",
                }}
              >
                <div className="flex items-start gap-2">
                  <Quote size={14} color="#F97316" className="shrink-0 mt-0.5" />
                  <p className="text-a26-text text-[12px] leading-[1.65] m-0 italic">
                    {quote}
                  </p>
                </div>
              </div>

              <p className="text-a26-mid text-[11.5px] leading-[1.7] m-0">
                {reflection}
              </p>
            </article>;
          })}
        </div>
      </div>
    </div>
  );
}