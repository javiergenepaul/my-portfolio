"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAurora } from "../use-aurora";
import { MAC_FONT } from "../constants";
import { hexRgb } from "../utils";

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
  const A = useAurora();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });

  // Clamp to viewport after render so menu never overflows
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

  // Close on outside click or Escape
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
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: 99900,
        background: A.window,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${A.glassBorder}`,
        borderRadius: 10,
        boxShadow: "0 12px 40px rgba(0,0,0,0.40), 0 2px 8px rgba(0,0,0,0.20)",
        minWidth: 210,
        padding: "4px 0",
        fontFamily: MAC_FONT,
        userSelect: "none",
      }}
    >
      {items.map((item, i) => {
        if (item.type === "separator") {
          return (
            <div
              key={i}
              style={{
                height: 1,
                background: A.glassBorder,
                margin: "3px 0",
              }}
            />
          );
        }

        if (item.type === "header") {
          return (
            <div
              key={i}
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: A.textMuted,
                padding: "4px 14px 2px",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
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
                e.currentTarget.style.background = `rgba(${hexRgb(A.blue)},0.18)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "calc(100% - 8px)",
              margin: "0 4px",
              padding: "5px 10px",
              border: "none",
              background: "transparent",
              color: item.disabled
                ? A.textMuted
                : item.danger
                  ? "#FF453A"
                  : A.text,
              fontSize: 13,
              fontFamily: MAC_FONT,
              cursor: item.disabled ? "default" : "pointer",
              textAlign: "left",
              borderRadius: 6,
              transition: "background 0.08s",
              opacity: item.disabled ? 0.45 : 1,
            }}
          >
            {item.icon && (
              <span
                style={{
                  width: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  opacity: 0.75,
                }}
              >
                {item.icon}
              </span>
            )}
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.shortcut && (
              <span
                style={{
                  fontSize: 11,
                  color: A.textMuted,
                  marginLeft: 12,
                  flexShrink: 0,
                  fontFamily: "monospace",
                }}
              >
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
