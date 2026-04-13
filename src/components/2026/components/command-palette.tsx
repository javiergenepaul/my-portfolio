"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, GithubIcon, LinkedinIcon, Mail } from "lucide-react";
import { GITHUB_URL, LINKED_IN_URL } from "@/config/url";
import { EMAIL_ADDRESS } from "@/config";
import { A, MAC_FONT, WIN_DEFS } from "../constants";
import type { WinId } from "../constants";

export function CommandPalette({
  open,
  onClose,
  onOpen,
}: {
  open: boolean;
  onClose: () => void;
  onOpen: (id: WinId) => void;
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const items = [
    ...WIN_DEFS.map((d) => ({
      label: `Open ${d.title}`,
      icon: d.icon,
      color: d.color,
      action: () => onOpen(d.id),
    })),
    {
      label: "View GitHub",
      icon: <GithubIcon size={13} />,
      color: A.text,
      action: () => window.open(GITHUB_URL, "_blank"),
    },
    {
      label: "View LinkedIn",
      icon: <LinkedinIcon size={13} />,
      color: "#60A5FA",
      action: () => window.open(LINKED_IN_URL, "_blank"),
    },
    {
      label: "Send Email",
      icon: <Mail size={13} />,
      color: A.teal,
      action: () => window.open(`mailto:${EMAIL_ADDRESS}`, "_blank"),
    },
  ];
  const filtered = q
    ? items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()))
    : items;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="ov"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9500,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
            }}
          />
          <motion.div
            key="pl"
            initial={{ opacity: 0, scale: 0.96, y: -14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.17 }}
            style={{
              position: "fixed",
              top: "18%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(540px,calc(100vw-32px))",
              background: "rgba(18,18,18,0.97)",
              border: `1px solid ${A.windowBorder}`,
              borderRadius: 13,
              overflow: "hidden",
              zIndex: 9501,
              boxShadow: "0 28px 64px rgba(0,0,0,0.78)",
              fontFamily: MAC_FONT,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "11px 14px",
                borderBottom: `1px solid ${A.glassBorder}`,
              }}
            >
              <Search size={14} color={A.textMuted} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && onClose()}
                placeholder="Search commands..."
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: A.text,
                  fontSize: 14,
                  fontFamily: MAC_FONT,
                }}
                aria-label="Command search"
              />
              <kbd
                style={{
                  fontSize: 10,
                  color: A.textMuted,
                  background: A.glass,
                  border: `1px solid ${A.glassBorder}`,
                  borderRadius: 4,
                  padding: "1px 5px",
                }}
              >
                ESC
              </kbd>
            </div>
            <div
              style={{
                padding: "5px 6px 6px",
                maxHeight: 300,
                overflowY: "auto",
                scrollbarWidth: "none",
              }}
            >
              {filtered.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    width: "100%",
                    padding: "8px 9px",
                    borderRadius: 7,
                    border: "none",
                    background: "transparent",
                    color: A.text,
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.1s",
                    fontFamily: MAC_FONT,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = A.glass)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span style={{ color: item.color }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
              {!filtered.length && (
                <div
                  style={{
                    padding: "14px 9px",
                    color: A.textMuted,
                    fontSize: 13,
                  }}
                >
                  No results found.
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
