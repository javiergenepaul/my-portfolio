"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useLocaleRefresh } from "@/i18n";
import { WIN_DEFS } from "./constants";
import { useIsDark } from "./use-aurora";
import type { WinId, WinState } from "./constants";
import { useIsMobile } from "./hooks";
import { Terminal, User, FolderGit2, Layers, Mail, FileText, Settings2, Grid2x2, RefreshCcw } from "lucide-react";
import { MenuBar } from "./components/menu-bar";
import { DesktopIcon } from "./components/desktop-icon";
import { AppWindow } from "./components/app-window";
import { Dock } from "./components/dock";
import { CommandPalette } from "./components/command-palette";
import { ContextMenu, type ContextMenuEntry } from "./components/context-menu";
import { MobilePortfolio } from "./mobile/mobile-portfolio";

const LiveWallpaper = dynamic(
  () => import("./live-wallpaper").then((m) => ({ default: m.LiveWallpaper })),
  { ssr: false },
);

const INIT_WINS: Record<WinId, WinState> = {
  about:    { open: true,  minimized: false, maximized: false, zIndex: 20 },
  projects: { open: false, minimized: false, maximized: false, zIndex: 10 },
  terminal: { open: true,  minimized: false, maximized: false, zIndex: 21 },
  skills:   { open: false, minimized: false, maximized: false, zIndex: 10 },
  contact:  { open: false, minimized: false, maximized: false, zIndex: 10 },
  resume:   { open: false, minimized: false, maximized: false, zIndex: 10 },
  settings: { open: false, minimized: false, maximized: false, zIndex: 10 },
};

export function Portfolio2026() {
  useLocaleRefresh();
  const isDark = useIsDark();
  const isMobile = useIsMobile();
  const [wins, setWins] = useState<Record<WinId, WinState>>(INIT_WINS);
  const [topZ, setTopZ] = useState(30);
  const [cmdOpen, setCmdOpen] = useState(false);
  const desktopRef = useRef<HTMLElement>(null);
  const CELL_W = 96;
  const CELL_H = 100;

  const snapToGrid = (x: number, y: number) => ({
    x: Math.round(x / CELL_W) * CELL_W,
    y: Math.round(y / CELL_H) * CELL_H,
  });

  const [iconPositions, setIconPositions] = useState<Record<WinId, { x: number; y: number }>>(() =>
    Object.fromEntries(
      WIN_DEFS.map((def, i) => [def.id, { x: 1344, y: i * 100 }])
    ) as Record<WinId, { x: number; y: number }>
  );

  useEffect(() => {
    const snappedX = Math.round((window.innerWidth - 104) / CELL_W) * CELL_W;
    setIconPositions(
      Object.fromEntries(
        WIN_DEFS.map((def, i) => [def.id, { x: snappedX, y: i * CELL_H }])
      ) as Record<WinId, { x: number; y: number }>
    );
  }, []);

  const updateIconPos = useCallback((id: WinId, rawX: number, rawY: number) => {
    setIconPositions((prev) => {
      const snapped = snapToGrid(rawX, rawY);
      const others = (Object.entries(prev) as [WinId, { x: number; y: number }][])
        .filter(([k]) => k !== id)
        .map(([, p]) => snapToGrid(p.x, p.y));
      const isFree = (sx: number, sy: number) => !others.some((o) => o.x === sx && o.y === sy);
      if (isFree(snapped.x, snapped.y)) return { ...prev, [id]: snapped };
      const visited = new Set<string>();
      const queue = [snapped];
      while (queue.length) {
        const cell = queue.shift()!;
        const key = `${cell.x},${cell.y}`;
        if (visited.has(key)) continue;
        visited.add(key);
        if (cell.x < -CELL_W || cell.y < -CELL_H || cell.x > 4000 || cell.y > 4000) continue;
        if (isFree(cell.x, cell.y)) return { ...prev, [id]: cell };
        queue.push(
          { x: cell.x + CELL_W, y: cell.y },
          { x: cell.x - CELL_W, y: cell.y },
          { x: cell.x, y: cell.y + CELL_H },
          { x: cell.x, y: cell.y - CELL_H },
        );
      }
      return { ...prev, [id]: snapped };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; items: ContextMenuEntry[] } | null>(null);

  const openWin = useCallback(
    (id: WinId) => {
      const z = topZ + 1;
      setTopZ(z);
      setWins((w) => ({ ...w, [id]: { ...w[id], open: true, minimized: false, zIndex: z } }));
    },
    [topZ],
  );

  const closeWin = (id: WinId) =>
    setWins((w) => ({ ...w, [id]: { ...w[id], open: false, minimized: false } }));
  const minimizeWin = (id: WinId) =>
    setWins((w) => ({ ...w, [id]: { ...w[id], minimized: true } }));
  const maximizeWin = (id: WinId) =>
    setWins((w) => ({ ...w, [id]: { ...w[id], maximized: !w[id].maximized } }));
  const focusWin = useCallback(
    (id: WinId) => {
      const z = topZ + 1;
      setTopZ(z);
      setWins((w) => ({ ...w, [id]: { ...w[id], zIndex: z } }));
    },
    [topZ],
  );
  const restoreWin = (id: WinId) => openWin(id);

  const closeAll = () =>
    setWins((w) => {
      const next = { ...w };
      (Object.keys(next) as WinId[]).forEach((id) => (next[id] = { ...next[id], open: false, minimized: false }));
      return next;
    });

  const minimizeAll = () =>
    setWins((w) => {
      const next = { ...w };
      (Object.keys(next) as WinId[]).forEach((id) => {
        if (next[id].open) next[id] = { ...next[id], minimized: true };
      });
      return next;
    });

  const restoreAll = useCallback(() => {
    const z = topZ + WIN_DEFS.length;
    setTopZ(z);
    setWins((w) => {
      const next = { ...w };
      let zi = topZ;
      (Object.keys(next) as WinId[]).forEach((id) => {
        if (next[id].minimized || next[id].open) {
          zi += 1;
          next[id] = { ...next[id], open: true, minimized: false, zIndex: zi };
        }
      });
      return next;
    });
  }, [topZ]);

  const defaultIconPositions = useCallback(() => {
    const snappedX = Math.round((window.innerWidth - 104) / CELL_W) * CELL_W;
    return Object.fromEntries(
      WIN_DEFS.map((def, i) => [def.id, { x: snappedX, y: i * CELL_H }])
    ) as Record<WinId, { x: number; y: number }>;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const arrangeIcons = useCallback(() => setIconPositions(defaultIconPositions()), [defaultIconPositions]);
  const resetIconPos = useCallback((id: WinId) => {
    const positions = defaultIconPositions();
    setIconPositions((prev) => ({ ...prev, [id]: positions[id] }));
  }, [defaultIconPositions]);

  const WIN_ICONS: Record<WinId, React.ReactNode> = {
    about:    <User size={13} />,
    projects: <FolderGit2 size={13} />,
    terminal: <Terminal size={13} />,
    skills:   <Layers size={13} />,
    contact:  <Mail size={13} />,
    resume:   <FileText size={13} />,
    settings: <Settings2 size={13} />,
  };

  const openDesktopMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const items: ContextMenuEntry[] = [
      { type: "header", label: "Open" },
      ...WIN_DEFS.map((def) => ({
        type: "item" as const,
        label: def.title,
        icon: WIN_ICONS[def.id],
        action: () => openWin(def.id),
        disabled: wins[def.id].open && !wins[def.id].minimized,
      })),
      { type: "separator" },
      { type: "item", label: "Arrange Icons", icon: <Grid2x2 size={13} />, action: arrangeIcons },
    ];
    setCtxMenu({ x: e.clientX, y: e.clientY, items });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wins, openWin, arrangeIcons]);

  const openIconMenu = useCallback((e: React.MouseEvent, id: WinId) => {
    const def = WIN_DEFS.find((d) => d.id === id)!;
    const items: ContextMenuEntry[] = [
      {
        type: "item",
        label: `Open ${def.title}`,
        icon: WIN_ICONS[id],
        action: () => openWin(id),
        disabled: wins[id].open && !wins[id].minimized,
      },
      { type: "separator" },
      { type: "item", label: "Reset Position", icon: <RefreshCcw size={13} />, action: () => resetIconPos(id) },
    ];
    setCtxMenu({ x: e.clientX, y: e.clientY, items });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wins, openWin, resetIconPos]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === "k") { e.preventDefault(); setCmdOpen((v) => !v); return; }
      const idx = parseInt(e.key, 10);
      if (idx >= 1 && idx <= WIN_DEFS.length) { e.preventDefault(); openWin(WIN_DEFS[idx - 1].id); return; }
      if (e.key === "t") { e.preventDefault(); openWin("terminal"); }
      if (e.key === "r") { e.preventDefault(); openWin("resume"); }
      if (e.key === "m") { e.preventDefault(); minimizeAll(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [openWin]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!e.ctrlKey || e.key !== "`") return;
      e.preventDefault();
      const visible = WIN_DEFS
        .filter((def) => wins[def.id].open && !wins[def.id].minimized)
        .sort((a, b) => wins[b.id].zIndex - wins[a.id].zIndex);
      if (visible.length < 2) return;
      const next = e.shiftKey ? visible[visible.length - 1] : visible[1];
      focusWin(next.id);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [wins, focusWin]);

  if (isMobile) return <MobilePortfolio />;

  return (
    <>
      <a
        href="#desktop"
        className="font-mac text-[#05090E] font-semibold no-underline bg-a26-teal fixed left-4 z-99999 rounded-md py-1.25 px-3 text-[13px] transition-[top] duration-150"
        style={{ top: -40 }}
        onFocus={(e) => (e.currentTarget.style.top = "34px")}
        onBlur={(e) => (e.currentTarget.style.top = "-40px")}
      >
        Skip to content
      </a>

      <LiveWallpaper />
      {!isDark && (
        <div className="fixed inset-0 bg-white/70 z-0 pointer-events-none" />
      )}

      <div
        className="font-mac relative overflow-hidden z-1 w-screen h-dvh"
      >
        <MenuBar
          onCmdK={() => setCmdOpen(true)}
          onOpenWin={openWin}
          onCloseAll={closeAll}
          onMinimizeAll={minimizeAll}
          onRestoreAll={restoreAll}
          wins={wins}
        />

        <main
          ref={desktopRef}
          id="desktop"
          aria-label="Desktop"
          onContextMenu={openDesktopMenu}
          className="absolute inset-0 top-7"
        >
          {WIN_DEFS.map((def) => (
            <DesktopIcon
              key={def.id}
              id={def.id}
              label={def.title}
              color={def.color}
              isOpen={wins[def.id].open}
              onClick={() => openWin(def.id)}
              x={iconPositions[def.id].x}
              y={iconPositions[def.id].y}
              constraintRef={desktopRef}
              onPositionChange={(x, y) => updateIconPos(def.id, x, y)}
              onContextMenu={(e) => openIconMenu(e, def.id)}
            />
          ))}

          <AnimatePresence>
            {WIN_DEFS.map((def) => (
              <AppWindow
                key={def.id}
                def={def}
                state={wins[def.id]}
                onFocus={() => focusWin(def.id)}
                onClose={() => closeWin(def.id)}
                onMinimize={() => minimizeWin(def.id)}
                onMaximize={() => maximizeWin(def.id)}
                onOpen={openWin}
              />
            ))}
          </AnimatePresence>
        </main>

        <Dock windows={wins} onOpen={openWin} onRestore={restoreWin} />
        <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onOpen={openWin} />
        {ctxMenu && (
          <ContextMenu
            x={ctxMenu.x}
            y={ctxMenu.y}
            items={ctxMenu.items}
            onClose={() => setCtxMenu(null)}
          />
        )}
      </div>
    </>
  );
}
