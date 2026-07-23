"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, GithubIcon, LinkedinIcon, Mail } from "lucide-react";
import { useProfile, useSocialUrl } from "@/lib/content/use-content";
import { translate, useLocaleRefresh } from "@/i18n";
import { WIN_DEFS } from "../constants";
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
  useLocaleRefresh();
  const profile = useProfile();
  const githubUrl = useSocialUrl("github");
  const linkedInUrl = useSocialUrl("linkedIn");
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const items = [
    ...WIN_DEFS.filter((d) => !d.hideIcon).map((d) => ({
      label: translate("win26.commandPalette.open", {
        title: translate(`win26.windows.${d.id}` as any) || d.title,
      }),
      icon: d.icon,
      color: d.color,
      action: () => onOpen(d.id),
    })),
    {
      label: "View GitHub",
      icon: <GithubIcon size={13} />,
      color: "var(--a26-text)",
      action: () => window.open(githubUrl, "_blank"),
    },
    {
      label: "View LinkedIn",
      icon: <LinkedinIcon size={13} />,
      color: "#60A5FA",
      action: () => window.open(linkedInUrl, "_blank"),
    },
    {
      label: "Send Email",
      icon: <Mail size={13} />,
      color: "var(--a26-teal)",
      action: () => window.open(`mailto:${profile.email}`, "_blank"),
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
            className="fixed inset-0 z-9500 backdrop-blur-xs"
            style={{ background: "rgba(0,0,0,0.55)" }}
          />
          <motion.div
            key="pl"
            initial={{ opacity: 0, scale: 0.96, y: -14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.17 }}
            className="font-mac bg-a26-window border border-a26-window-border overflow-hidden fixed top-[18%] left-1/2 -translate-x-1/2 w-[min(540px,calc(100vw-32px))] rounded-[13px] z-9501"
            style={{ boxShadow: "0 28px 64px rgba(0,0,0,0.78)" }}
          >
            <div className="flex items-center border-b border-a26-glass-border gap-2.25 py-2.75 px-3.5">
              <Search size={14} color="var(--a26-text-muted)" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && onClose()}
                placeholder="Search commands..."
                className="flex-1 bg-transparent border-none outline-none text-a26-text font-mac text-sm"
                aria-label="Command search"
              />
              <kbd className="text-a26-muted bg-a26-glass border border-a26-glass-border text-[10px] rounded py-px px-1.25">
                ESC
              </kbd>
            </div>
            <div className="py-1.25 px-1.5 pb-1.5 max-h-75 overflow-y-auto [scrollbar-width:none]">
              {filtered.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="flex items-center w-full text-left font-mac text-a26-text gap-2.25 py-2 px-2.25 rounded-[7px] border-none bg-transparent text-[13px] cursor-pointer transition-[background] duration-100"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--a26-glass)")
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
                <div className="text-a26-muted py-3.5 px-2.25 text-[13px]">
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
