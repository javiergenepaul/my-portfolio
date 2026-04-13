"use client";

import { useState } from "react";
import { Search, Command } from "lucide-react";
import { A, MAC_FONT } from "../constants";
import { useTime } from "../hooks";

export function MenuBar({ onCmdK }: { onCmdK: () => void }) {
  const time = useTime();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        height: 28,
        background: A.menuBar,
        borderBottom: `1px solid ${A.menuBorder}`,
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        userSelect: "none",
        fontFamily: MAC_FONT,
      }}
    >
      {/* Left — logo + app name + menu items */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
        <div
          style={{
            padding: "0 8px",
            height: 28,
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 69 69" fill="none">
            <path
              d="M30.0798 25.1276V18C13.3577 18.89 10.27 45.55 31.11 47.33C43.33 47.33 48.51 34.72 44.27 26.09H31.18V33.49H38.85C38.99 37.33 35.15 41.37 29.6 40.34C20.28 38.08 21.79 26.02 30.08 25.13Z"
              fill={A.teal}
            />
            <path
              d="M31.11 18V24.78H45.02C48.86 30.68 49.15 47.44 31.11 48.43V55.83C46.94 55.83 62.29 36.78 48.86 18H31.11Z"
              fill={A.teal}
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: A.text,
            padding: "0 8px",
          }}
        >
          Gene Paul
        </span>
        {["File", "View", "Go", "Window"].map((item) => (
          <button
            key={item}
            onMouseEnter={() => setActiveMenu(item)}
            onMouseLeave={() => setActiveMenu(null)}
            style={{
              height: 28,
              padding: "0 9px",
              background:
                activeMenu === item ? "rgba(255,255,255,0.10)" : "transparent",
              borderRadius: 4,
              border: "none",
              color: activeMenu === item ? A.text : A.textMid,
              fontSize: 13,
              cursor: "default",
              fontFamily: MAC_FONT,
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Right — spotlight + clock */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          onClick={onCmdK}
          style={{
            height: 20,
            padding: "0 7px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: A.glass,
            border: `1px solid ${A.glassBorder}`,
            borderRadius: 5,
            color: A.textMid,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: MAC_FONT,
          }}
          title="Command Palette (⌘K)"
          aria-label="Open command palette"
        >
          <Search size={10} />
          <Command size={9} />
          <span style={{ fontSize: 10 }}>K</span>
        </button>
        <span style={{ fontSize: 12, color: A.text, fontWeight: 400 }}>
          {time}
        </span>
      </div>
    </div>
  );
}
