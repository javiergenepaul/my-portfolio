"use client";

import type { WinId } from "../constants";
import { MacAppIcon } from "../components/mac-app-icons";
import { translate, useLocaleRefresh } from "@/i18n";

function getGames(): { id: WinId; name: string; desc: string }[] {
  return [
    {
      id: "snake",
      name: translate("win26.games.snake.name" as any),
      desc: translate("win26.games.snake.desc" as any),
    },
    {
      id: "hanoi",
      name: translate("win26.games.hanoi.name" as any),
      desc: translate("win26.games.hanoi.desc" as any),
    },
    {
      id: "tetris",
      name: translate("win26.games.tetris.name" as any),
      desc: translate("win26.games.tetris.desc" as any),
    },
    {
      id: "jump",
      name: translate("win26.games.jump.name" as any),
      desc: translate("win26.games.jump.desc" as any),
    },
    {
      id: "bomber",
      name: translate("win26.games.bomber.name" as any),
      desc: translate("win26.games.bomber.desc" as any),
    },
  ];
}

export function GamesContent({ onOpen }: { onOpen: (id: WinId) => void }) {
  useLocaleRefresh();
  const GAMES = getGames();
  return (
    <div
      className="font-mac flex flex-col flex-1 min-h-0"
      style={{
        background: "var(--a26-window)",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* Toolbar */}
      <div
        className="shrink-0 flex items-center gap-2 px-5 py-2.5 border-b border-a26-glass-border"
        style={{ background: "var(--a26-glass)" }}
      >
        <span className="text-a26-text text-[13px] font-semibold">
          {translate("win26.games.title" as any)}
        </span>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full"
          style={{
            background: "color-mix(in srgb, #F97316 14%, transparent)",
            color: "#FB923C",
            border: "1px solid color-mix(in srgb, #F97316 28%, transparent)",
          }}
        >
          {translate("win26.games.apps" as any).replace(
            "{count}",
            String(GAMES.length),
          )}
        </span>
      </div>

      {/* Icon grid */}
      <div
        className="flex-1 overflow-y-auto p-5 [scrollbar-width:thin]"
        style={{ scrollbarColor: "rgba(255,255,255,0.12) transparent" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 12,
          }}
        >
          {GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => onOpen(g.id)}
              className="font-mac flex flex-col items-center gap-2 p-4 rounded-[14px] border-none cursor-pointer transition-all duration-150 text-center"
              style={{
                background: "var(--a26-glass)",
                border: "1px solid var(--a26-glass-border)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--a26-card)";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "var(--a26-glass)";
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)";
              }}
            >
              <MacAppIcon id={g.id} size={60} />
              <div className="text-a26-text text-[12px] font-semibold">
                {g.name}
              </div>
              <div className="text-a26-muted text-[10px]">{g.desc}</div>
            </button>
          ))}

          {/* Coming soon placeholder */}
          <div
            className="flex flex-col items-center gap-2 p-4 rounded-[14px] text-center opacity-35"
            style={{ border: "1.5px dashed var(--a26-glass-border)" }}
          >
            <div
              className="w-15 h-15 rounded-[14px] flex items-center justify-center"
              style={{ background: "var(--a26-glass)", fontSize: 26 }}
            >
              🎮
            </div>
            <div className="text-a26-muted text-[11px] font-medium">
              {translate("win26.games.moreComing" as any)}
            </div>
            <div className="text-a26-muted text-[10px]">
              {translate("win26.games.soon" as any)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
