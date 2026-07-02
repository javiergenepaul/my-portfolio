"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { translate, useLocaleRefresh } from "@/i18n";
import { useLanguageStore } from "@/stores";
import { WIN_DEFS } from "./constants";
import { useIsDark } from "./use-aurora";
import type { WinId, WinState } from "./constants";
import { useIsMobile } from "./hooks";
import {
  Terminal,
  User,
  BookOpen,
  Quote,
  Maximize2,
  FolderGit2,
  Headphones,
  Layers,
  Mail,
  FileText,
  Settings2,
  Grid2x2,
  RefreshCcw,
  Sparkles,
  Gamepad2,
  Zap,
  Layers3 as HanoiIcon,
  LayoutGrid,
  Flame,
} from "lucide-react";
import { MenuBar } from "./components/menu-bar";
import { DesktopIcon } from "./components/desktop-icon";
import { AppWindow } from "./components/app-window";
import { Dock } from "./components/dock";
import { CommandPalette } from "./components/command-palette";
import { ContextMenu, type ContextMenuEntry } from "./components/context-menu";

const LiveWallpaper = dynamic(
  () => import("./live-wallpaper").then((m) => ({ default: m.LiveWallpaper })),
  { ssr: false },
);
const MobilePortfolio = dynamic(
  () =>
    import("./mobile/mobile-portfolio").then((m) => ({
      default: m.MobilePortfolio,
    })),
  { ssr: false },
);

const INIT_WINS: Record<WinId, WinState> = {
  about: { open: true, minimized: false, maximized: false, zIndex: 24 },
  books: { open: false, minimized: false, maximized: false, zIndex: 10 },
  testimonials: { open: false, minimized: false, maximized: false, zIndex: 10 },
  projects: { open: false, minimized: false, maximized: false, zIndex: 10 },
  itunes: { open: true, minimized: false, maximized: false, zIndex: 23 },
  terminal: { open: true, minimized: false, maximized: false, zIndex: 21 },
  skills: { open: false, minimized: false, maximized: false, zIndex: 10 },
  contact: { open: false, minimized: false, maximized: false, zIndex: 10 },
  resume: { open: false, minimized: false, maximized: false, zIndex: 10 },
  settings: { open: false, minimized: false, maximized: false, zIndex: 10 },
  chat: { open: true, minimized: false, maximized: false, zIndex: 22 },
  games: { open: false, minimized: false, maximized: false, zIndex: 10 },
  snake: { open: false, minimized: false, maximized: false, zIndex: 10 },
  hanoi: { open: false, minimized: false, maximized: false, zIndex: 10 },
  tetris: { open: false, minimized: false, maximized: false, zIndex: 10 },
  jump: { open: false, minimized: false, maximized: false, zIndex: 10 },
  bomber: { open: false, minimized: false, maximized: false, zIndex: 10 },
};

const SSR_WINS: Record<WinId, WinState> = Object.fromEntries(
  (Object.entries(INIT_WINS) as [WinId, WinState][]).map(([id, state]) => [
    id,
    { ...state, open: false, minimized: false },
  ]),
) as Record<WinId, WinState>;

// Only defs that get a desktop icon (excludes hideIcon: true entries)
const VISIBLE_DEFS = WIN_DEFS.filter((d) => !d.hideIcon);

function SeoLandmarks2026() {
  return (
    <div className="sr-only">
      <header>
        <h1>Gene Paul Mar Javier 2026 Portfolio</h1>
        <p>
          Explore Gene Paul Mar Javier&apos;s 2026 macOS-inspired portfolio,
          featuring projects, skills, resume, contact details, music, and
          interactive desktop windows.
        </p>
        <Image
          src="/ghibli-avatar.png"
          alt="Portrait of Gene Paul Mar Javier"
          width={96}
          height={96}
        />
      </header>
      <nav aria-label="2026 portfolio links">
        <Link href="/">Portfolio home</Link>
        <Link href="/2024">2024 portfolio</Link>
        <Link href="/2025">2025 portfolio</Link>
        <Link href="/2027">2027 portfolio</Link>
        <Link href="/2026#desktop">2026 desktop</Link>
      </nav>
      <nav aria-label="External profiles">
        <a
          href="https://github.com/javiergenepaul"
          target="_blank"
          rel="noreferrer"
        >
          GitHub profile
        </a>
        <a
          href="https://www.linkedin.com/in/gene-paul-mar-javier-500b93245/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn profile
        </a>
      </nav>
    </div>
  );
}

export function Portfolio2026() {
  useLocaleRefresh();
  const isDark = useIsDark();
  const isMobile = useIsMobile();
  const { setLanguage } = useLanguageStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [showIntroSplash, setShowIntroSplash] = useState(false);

  // Reset to English each time the 2026 portfolio loads
  useEffect(() => {
    setLanguage("en");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [wins, setWins] = useState<Record<WinId, WinState>>(SSR_WINS);
  const [topZ, setTopZ] = useState(30);
  const [cmdOpen, setCmdOpen] = useState(false);
  const desktopRef = useRef<HTMLElement>(null);
  const CELL_W = 96;
  const CELL_H = 96;

  const snapToGrid = (x: number, y: number) => ({
    x: Math.round(x / CELL_W) * CELL_W,
    y: Math.round(y / CELL_H) * CELL_H,
  });

  // Icon grid — only visible defs (no hideIcon)
  const calcIconGrid = (vw: number) => {
    const colBase = Math.round((vw - CELL_W) / CELL_W) * CELL_W; // rightmost snap column
    const COLS = 2;
    return Object.fromEntries(
      VISIBLE_DEFS.map((def, i) => [
        def.id,
        {
          x: colBase - (i % COLS) * CELL_W,
          y: Math.floor(i / COLS) * CELL_H,
        },
      ]),
    ) as Partial<Record<WinId, { x: number; y: number }>>;
  };

  const [iconPositions, setIconPositions] = useState<
    Partial<Record<WinId, { x: number; y: number }>>
  >(() => calcIconGrid(1440));

  useEffect(() => {
    setIconPositions(calcIconGrid(window.innerWidth));
  }, []);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setWins(INIT_WINS);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    if (typeof window === "undefined") return;
    if (document.fullscreenElement) return;

    const timer = window.setTimeout(() => {
      setShowIntroSplash(true);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [isMobile]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setShowIntroSplash(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const dismissIntroSplash = useCallback(() => {
    setShowIntroSplash(false);
  }, []);

  const enableFullscreenExperience = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen?.();
    } finally {
      dismissIntroSplash();
    }
  }, [dismissIntroSplash]);

  const updateIconPos = useCallback((id: WinId, rawX: number, rawY: number) => {
    setIconPositions((prev) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Keep icons within the visible desktop area (below menu bar, above dock)
      const maxX = Math.floor((vw - CELL_W) / CELL_W) * CELL_W;
      const maxY = Math.floor((vh - 28 - CELL_H - 20) / CELL_H) * CELL_H;

      const clampCell = (x: number, y: number) => ({
        x: Math.max(0, Math.min(maxX, Math.round(x / CELL_W) * CELL_W)),
        y: Math.max(0, Math.min(maxY, Math.round(y / CELL_H) * CELL_H)),
      });

      const snapped = clampCell(rawX, rawY);

      const others = (
        Object.entries(prev) as [WinId, { x: number; y: number } | undefined][]
      )
        .filter(([k, v]) => k !== id && v !== undefined)
        .map(([, p]) => clampCell(p!.x, p!.y));

      const inBounds = (x: number, y: number) =>
        x >= 0 && y >= 0 && x <= maxX && y <= maxY;
      const isFree = (x: number, y: number) =>
        inBounds(x, y) && !others.some((o) => o.x === x && o.y === y);

      if (isFree(snapped.x, snapped.y)) return { ...prev, [id]: snapped };

      const visited = new Set<string>();
      const queue = [snapped];
      while (queue.length) {
        const cell = queue.shift()!;
        const key = `${cell.x},${cell.y}`;
        if (visited.has(key)) continue;
        visited.add(key);
        if (!inBounds(cell.x, cell.y)) continue;
        if (isFree(cell.x, cell.y)) return { ...prev, [id]: cell };
        queue.push(
          { x: cell.x + CELL_W, y: cell.y },
          { x: cell.x - CELL_W, y: cell.y },
          { x: cell.x, y: cell.y + CELL_H },
          { x: cell.x, y: cell.y - CELL_H },
        );
      }
      // Fallback: clamped original position
      return { ...prev, [id]: snapped };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [ctxMenu, setCtxMenu] = useState<{
    x: number;
    y: number;
    items: ContextMenuEntry[];
  } | null>(null);

  const openWin = useCallback(
    (id: WinId) => {
      const z = topZ + 1;
      setTopZ(z);
      setWins((w) => ({
        ...w,
        [id]: { ...w[id], open: true, minimized: false, zIndex: z },
      }));
    },
    [topZ],
  );

  const closeWin = (id: WinId) =>
    setWins((w) => ({
      ...w,
      [id]: { ...w[id], open: false, minimized: false },
    }));
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
      (Object.keys(next) as WinId[]).forEach(
        (id) => (next[id] = { ...next[id], open: false, minimized: false }),
      );
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

  const defaultIconPositions = useCallback(
    () => calcIconGrid(window.innerWidth),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const arrangeIcons = useCallback(
    () => setIconPositions(defaultIconPositions()),
    [defaultIconPositions],
  );
  const resetIconPos = useCallback(
    (id: WinId) => {
      const positions = defaultIconPositions();
      setIconPositions((prev) => ({ ...prev, [id]: positions[id] }));
    },
    [defaultIconPositions],
  );

  const WIN_ICONS: Record<WinId, React.ReactNode> = {
    about: <User size={13} />,
    books: <BookOpen size={13} />,
    testimonials: <Quote size={13} />,
    projects: <FolderGit2 size={13} />,
    itunes: <Headphones size={13} />,
    terminal: <Terminal size={13} />,
    skills: <Layers size={13} />,
    contact: <Mail size={13} />,
    resume: <FileText size={13} />,
    settings: <Settings2 size={13} />,
    chat: <Sparkles size={13} />,
    games: <Gamepad2 size={13} />,
    snake: <Zap size={13} />,
    hanoi: <HanoiIcon size={13} />,
    tetris: <LayoutGrid size={13} />,
    jump: <Zap size={13} />,
    bomber: <Flame size={13} />,
  };

  const openDesktopMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const items: ContextMenuEntry[] = [
        { type: "header", label: "Open" },
        ...VISIBLE_DEFS.map((def) => ({
          type: "item" as const,
          label: translate(`win26.windows.${def.id}` as any) || def.title,
          icon: WIN_ICONS[def.id],
          action: () => openWin(def.id),
          disabled: wins[def.id].open && !wins[def.id].minimized,
        })),
        { type: "separator" },
        {
          type: "item",
          label: "Arrange Icons",
          icon: <Grid2x2 size={13} />,
          action: arrangeIcons,
        },
      ];
      setCtxMenu({ x: e.clientX, y: e.clientY, items });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [wins, openWin, arrangeIcons],
  );

  const openIconMenu = useCallback(
    (e: React.MouseEvent, id: WinId) => {
      const def = WIN_DEFS.find((d) => d.id === id)!;
      const items: ContextMenuEntry[] = [
        {
          type: "item",
          label: `Open ${translate(`win26.windows.${def.id}` as any) || def.title}`,
          icon: WIN_ICONS[id],
          action: () => openWin(id),
          disabled: wins[id].open && !wins[id].minimized,
        },
        { type: "separator" },
        {
          type: "item",
          label: "Reset Position",
          icon: <RefreshCcw size={13} />,
          action: () => resetIconPos(id),
        },
      ];
      setCtxMenu({ x: e.clientX, y: e.clientY, items });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [wins, openWin, resetIconPos],
  );

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
        return;
      }
      const idx = parseInt(e.key, 10);
      if (idx >= 1 && idx <= WIN_DEFS.length) {
        e.preventDefault();
        openWin(WIN_DEFS[idx - 1].id);
        return;
      }
      if (e.key === "t") {
        e.preventDefault();
        openWin("terminal");
      }
      if (e.key === "r") {
        e.preventDefault();
        openWin("resume");
      }
      if (e.key === "m") {
        e.preventDefault();
        minimizeAll();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [openWin]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!e.ctrlKey || e.key !== "`") return;
      e.preventDefault();
      const visible = WIN_DEFS.filter(
        (def) => wins[def.id].open && !wins[def.id].minimized,
      ).sort((a, b) => wins[b.id].zIndex - wins[a.id].zIndex);
      if (visible.length < 2) return;
      const next = e.shiftKey ? visible[visible.length - 1] : visible[1];
      focusWin(next.id);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [wins, focusWin]);

  if (!isHydrated) {
    return (
      <>
        <SeoLandmarks2026 />
        <div className="font-mac relative z-1 w-screen h-dvh bg-black" />
      </>
    );
  }

  if (isMobile) {
    return (
      <>
        <SeoLandmarks2026 />
        <MobilePortfolio />
      </>
    );
  }

  return (
    <>
      <SeoLandmarks2026 />

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

      <div className="font-mac relative overflow-hidden z-1 w-screen h-dvh">
        <nav
          aria-label="Portfolio pages"
          className="pointer-events-auto fixed left-1/2 -translate-x-1/2 top-10 z-60 flex flex-wrap items-center gap-2 rounded-2xl border border-white/12 bg-black/28 px-3 py-2 text-[11px] text-white/78 backdrop-blur-xl"
        >
          <Link
            href="/"
            className="rounded-md px-2 py-1 text-inherit no-underline hover:bg-white/10 hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/2024"
            className="rounded-md px-2 py-1 text-inherit no-underline hover:bg-white/10 hover:text-white"
          >
            2024
          </Link>
          <Link
            href="/2025"
            className="rounded-md px-2 py-1 text-inherit no-underline hover:bg-white/10 hover:text-white"
          >
            2025
          </Link>
          <Link
            href="/2027"
            className="rounded-md px-2 py-1 text-inherit no-underline hover:bg-white/10 hover:text-white"
          >
            2027
          </Link>
        </nav>

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
          {VISIBLE_DEFS.map((def) => (
            <DesktopIcon
              key={def.id}
              id={def.id}
              label={translate(`win26.windows.${def.id}` as any) || def.title}
              color={def.color}
              isOpen={wins[def.id].open}
              onClick={() => openWin(def.id)}
              x={iconPositions[def.id]?.x ?? 0}
              y={iconPositions[def.id]?.y ?? 0}
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
        <CommandPalette
          open={cmdOpen}
          onClose={() => setCmdOpen(false)}
          onOpen={openWin}
        />
        {ctxMenu && (
          <ContextMenu
            x={ctxMenu.x}
            y={ctxMenu.y}
            items={ctxMenu.items}
            onClose={() => setCtxMenu(null)}
          />
        )}
        {showIntroSplash && (
          <div
            className="fixed inset-0 z-9700 flex items-center justify-center overflow-hidden px-6 py-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="win26-fullscreen-title"
            aria-describedby="win26-fullscreen-desc"
          >
            <div className="absolute inset-0 bg-[#08111a]/90 backdrop-blur-xl" />
            <div className="absolute inset-0 opacity-70">
              <div className="absolute left-1/2 top-[18%] h-56 w-56 -translate-x-1/2 rounded-full bg-(--a26-teal)/20 blur-3xl" />
              <div className="absolute bottom-[14%] right-[16%] h-48 w-48 rounded-full bg-white/8 blur-3xl" />
            </div>

            <div className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">
              <div
                className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl border"
                style={{
                  background:
                    "color-mix(in srgb, var(--a26-teal) 16%, transparent)",
                  borderColor:
                    "color-mix(in srgb, var(--a26-teal) 24%, transparent)",
                }}
              >
                <Maximize2 size={28} color="var(--a26-teal)" />
              </div>

              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-white/45">
                2026 Experience
              </div>
              <h2
                id="win26-fullscreen-title"
                className="m-0 max-w-lg text-[28px] font-semibold leading-tight text-white sm:text-[34px]"
              >
                {translate("win26.fullscreenPrompt.title")}
              </h2>
              <p
                id="win26-fullscreen-desc"
                className="mt-4 mb-0 max-w-md text-[13px] leading-7 text-white/62 sm:text-[14px]"
              >
                {translate("win26.fullscreenPrompt.description")}
              </p>

              <div className="mt-6 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left backdrop-blur">
                <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
                  {translate("win26.fullscreenPrompt.tipLabel")}
                </div>
                <div className="mt-2 text-[12px] leading-6 text-white/72">
                  {translate("win26.fullscreenPrompt.tipBody")}
                </div>
              </div>

              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
                <button
                  onClick={enableFullscreenExperience}
                  className="font-mac min-w-48 cursor-pointer rounded-xl border px-4 py-3 text-[12px] font-semibold"
                  style={{
                    background:
                      "color-mix(in srgb, var(--a26-teal) 18%, transparent)",
                    borderColor:
                      "color-mix(in srgb, var(--a26-teal) 30%, transparent)",
                    color: "var(--a26-teal)",
                  }}
                >
                  {translate("win26.fullscreenPrompt.enable")}
                </button>
                <button
                  onClick={dismissIntroSplash}
                  className="font-mac min-w-40 cursor-pointer rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-[12px] text-white/72"
                >
                  {translate("win26.fullscreenPrompt.skip")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
