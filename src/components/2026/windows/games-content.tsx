"use client";

import type { WinId } from "../constants";
import { MacAppIcon } from "../components/mac-app-icons";

const GAMES: { id: WinId; name: string; desc: string }[] = [
  { id: "snake", name: "Snake",           desc: "Classic retro snake game"       },
  { id: "hanoi", name: "Tower of Hanoi",  desc: "Move all discs from A to C"     },
];

export function GamesContent({ onOpen }: { onOpen: (id: WinId) => void }) {
  return (
    <div className="font-mac flex flex-col flex-1 min-h-0" style={{ background: "var(--a26-window)" }}>
      {/* Toolbar */}
      <div
        className="shrink-0 flex items-center gap-2 px-5 py-2.5 border-b border-a26-glass-border"
        style={{ background: "var(--a26-glass)" }}
      >
        <span className="text-a26-text text-[13px] font-semibold">Games</span>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full"
          style={{
            background: "color-mix(in srgb, #F97316 14%, transparent)",
            color: "#FB923C",
            border: "1px solid color-mix(in srgb, #F97316 28%, transparent)",
          }}
        >
          {GAMES.length} apps
        </span>
      </div>

      {/* Icon grid */}
      <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:thin]" style={{ scrollbarColor: "rgba(255,255,255,0.12) transparent" }}>
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
                (e.currentTarget as HTMLButtonElement).style.background = "var(--a26-card)";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--a26-glass)";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              <MacAppIcon id={g.id} size={60} />
              <div className="text-a26-text text-[12px] font-semibold">{g.name}</div>
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
            <div className="text-a26-muted text-[11px] font-medium">More coming</div>
            <div className="text-a26-muted text-[10px]">soon...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
