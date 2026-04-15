"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type ContextMenuEntry =
  | {
      type: "item";
      label: string;
      icon?: React.ReactNode;
      shortcut?: string;
      action: () => void;
      disabled?: boolean;
      danger?: boolean;
    }
  | { type: "separator" }
  | { type: "header"; label: string };

interface Props {
  x: number;
  y: number;
  items: ContextMenuEntry[];
  onClose: () => void;
}

export function ContextMenu({ x, y, items, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setPos({
      x: Math.min(x, vw - width - 8),
      y: Math.min(y, vh - height - 8),
    });
  }, [x, y]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      onContextMenu={(e) => e.preventDefault()}
      className="font-mac bg-a26-window border border-a26-glass-border select-none fixed z-99900 backdrop-blur-xl rounded-[10px] min-w-52.5 py-1"
      style={{
        left: pos.x,
        top: pos.y,
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.40), 0 2px 8px rgba(0,0,0,0.20)",
      }}
    >
      {items.map((item, i) => {
        if (item.type === "separator") {
          return <div key={i} className="bg-a26-glass-border h-px my-0.75" />;
        }

        if (item.type === "header") {
          return (
            <div
              key={i}
              className="text-a26-muted text-[10px] font-bold pt-1 pb-0.5 px-3.5 tracking-[0.07em] uppercase"
            >
              {item.label}
            </div>
          );
        }

        return (
          <button
            key={i}
            disabled={item.disabled}
            onClick={() => {
              if (!item.disabled) {
                item.action();
                onClose();
              }
            }}
            onMouseEnter={(e) => {
              if (!item.disabled)
                e.currentTarget.style.background =
                  "color-mix(in srgb, var(--a26-blue) 18%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            className="font-mac flex items-center text-left gap-2 w-[calc(100%-8px)] mx-1 py-1.25 px-2.5 border-none bg-transparent text-[13px] rounded-[6px] transition-[background] duration-80"
            style={{
              color: item.disabled
                ? "var(--a26-text-muted)"
                : item.danger
                  ? "#FF453A"
                  : "var(--a26-text)",
              cursor: item.disabled ? "default" : "pointer",
              opacity: item.disabled ? 0.45 : 1,
            }}
          >
            {item.icon && (
              <span className="flex items-center justify-center shrink-0 w-4 opacity-75">
                {item.icon}
              </span>
            )}
            <span className="flex-1">{item.label}</span>
            {item.shortcut && (
              <span className="text-a26-muted shrink-0 text-[11px] ml-3 font-mono">
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
