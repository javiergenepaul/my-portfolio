"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Command, Monitor } from "lucide-react";
import { WIN_DEFS } from "../constants";
import type { WinId, WinState } from "../constants";
import { useTime } from "../hooks";

type MenuId = "file" | "view" | "go" | "window";

interface MenuBarProps {
  onCmdK: () => void;
  onOpenWin: (id: WinId) => void;
  onCloseAll: () => void;
  onMinimizeAll: () => void;
  onRestoreAll: () => void;
  wins: Record<WinId, WinState>;
}

function Separator() {
  return <div className="h-px bg-white/10 my-1" />;
}

function MenuItem({
  label,
  shortcut,
  checked,
  disabled,
  onClick,
}: {
  label: string;
  shortcut?: string;
  checked?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="font-mac flex items-center w-full text-left relative whitespace-nowrap py-1.25 pr-3 pl-6.5 border-none rounded-[5px] text-[13px]"
      style={{
        background: hov && !disabled ? "var(--a26-glass)" : "transparent",
        color: disabled ? "var(--a26-text-muted)" : "var(--a26-text)",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {checked && (
        <span className="absolute text-a26-teal left-2.25 text-[11px]">✓</span>
      )}
      <span className="flex-1">{label}</span>
      {shortcut && (
        <span className="text-a26-muted font-mac text-xs ml-5">
          {shortcut}
        </span>
      )}
    </button>
  );
}

function Dropdown({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="bg-a26-window border border-a26-window-border absolute top-[calc(100%+2px)] left-0 min-w-55 rounded-lg backdrop-blur-xl py-1 px-1.5 z-9999"
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.40), 0 2px 8px rgba(0,0,0,0.30)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function MenuBar({
  onCmdK,
  onOpenWin,
  onCloseAll,
  onMinimizeAll,
  onRestoreAll,
  wins,
}: MenuBarProps) {
  const time = useTime();
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeMenu) return;
    const handler = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setActiveMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeMenu]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveMenu(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggle = (id: MenuId) => setActiveMenu((prev) => (prev === id ? null : id));
  const act = (fn: () => void) => { setActiveMenu(null); fn(); };

  const anyOpen = Object.values(wins).some((w) => w.open);
  const anyMinimized = Object.values(wins).some((w) => w.minimized);
  const isFullscreen = typeof document !== "undefined" && !!document.fullscreenElement;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const menuBtnCls = "font-mac h-7 px-2.25 rounded border-none text-[13px] cursor-pointer";
  const menuBtnDyn = (id: MenuId): React.CSSProperties => ({
    background: activeMenu === id ? "rgba(255,255,255,0.14)" : "transparent",
    color: activeMenu === id ? "var(--a26-text)" : "var(--a26-text-mid)",
  });

  return (
    <div
      ref={barRef}
      className="font-mac bg-a26-menu-bar border-b border-a26-menu-border select-none fixed top-0 left-0 right-0 z-9000 h-7 flex items-center px-3"
      style={{
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
      }}
    >
      {/* Left side */}
      <div className="flex items-center flex-1">
        {/* Logo */}
        <div className="flex items-center px-2 h-7">
          <svg width="13" height="13" viewBox="0 0 69 69" fill="none">
            <path
              d="M30.0798 25.1276V18C13.3577 18.89 10.27 45.55 31.11 47.33C43.33 47.33 48.51 34.72 44.27 26.09H31.18V33.49H38.85C38.99 37.33 35.15 41.37 29.6 40.34C20.28 38.08 21.79 26.02 30.08 25.13Z"
              fill="var(--a26-teal)"
            />
            <path
              d="M31.11 18V24.78H45.02C48.86 30.68 49.15 47.44 31.11 48.43V55.83C46.94 55.83 62.29 36.78 48.86 18H31.11Z"
              fill="var(--a26-teal)"
            />
          </svg>
        </div>

        <span className="text-a26-text text-[13px] font-semibold px-2">GPM</span>

        {/* File */}
        <div className="relative">
          <button onClick={() => toggle("file")} className={menuBtnCls} style={menuBtnDyn("file")}>File</button>
          {activeMenu === "file" && (
            <Dropdown>
              <MenuItem label="New Terminal Window" shortcut="⌘T" onClick={() => act(() => onOpenWin("terminal"))} />
              <MenuItem label="Open Resume Builder" shortcut="⌘R" onClick={() => act(() => onOpenWin("resume"))} />
              <Separator />
              <MenuItem label="Close All Windows" disabled={!anyOpen} onClick={() => act(onCloseAll)} />
            </Dropdown>
          )}
        </div>

        {/* View */}
        <div className="relative">
          <button onClick={() => toggle("view")} className={menuBtnCls} style={menuBtnDyn("view")}>View</button>
          {activeMenu === "view" && (
            <Dropdown>
              <MenuItem
                label={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
                shortcut="⌃⌘F"
                onClick={() => act(toggleFullscreen)}
              />
              <Separator />
              <MenuItem label="Command Palette" shortcut="⌘K" onClick={() => act(onCmdK)} />
              <Separator />
              <MenuItem label="Restore All Windows" disabled={!anyMinimized} onClick={() => act(onRestoreAll)} />
            </Dropdown>
          )}
        </div>

        {/* Go */}
        <div className="relative">
          <button onClick={() => toggle("go")} className={menuBtnCls} style={menuBtnDyn("go")}>Go</button>
          {activeMenu === "go" && (
            <Dropdown>
              {WIN_DEFS.filter((d) => !d.hideIcon).map((def, i) => (
                <MenuItem
                  key={def.id}
                  label={def.title}
                  shortcut={`⌘${i + 1}`}
                  checked={wins[def.id].open && !wins[def.id].minimized}
                  onClick={() => act(() => onOpenWin(def.id))}
                />
              ))}
            </Dropdown>
          )}
        </div>

        {/* Window */}
        <div className="relative">
          <button onClick={() => toggle("window")} className={menuBtnCls} style={menuBtnDyn("window")}>Window</button>
          {activeMenu === "window" && (
            <Dropdown>
              <MenuItem label="Cycle Windows" shortcut="⌃`" disabled={!anyOpen} onClick={() => act(() => {})} />
              <Separator />
              <MenuItem label="Minimize All" shortcut="⌘M" disabled={!anyOpen} onClick={() => act(onMinimizeAll)} />
              <MenuItem label="Restore All" disabled={!anyMinimized} onClick={() => act(onRestoreAll)} />
              <Separator />
              {WIN_DEFS.filter((d) => !d.hideIcon).map((def) => (
                <MenuItem
                  key={def.id}
                  label={def.title}
                  checked={wins[def.id].open && !wins[def.id].minimized}
                  onClick={() =>
                    act(() =>
                      wins[def.id].open && !wins[def.id].minimized ? undefined : onOpenWin(def.id),
                    )
                  }
                />
              ))}
            </Dropdown>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onCmdK}
          className="font-mac flex items-center bg-a26-glass border border-a26-glass-border text-a26-mid h-5 px-1.75 gap-1 rounded-[5px] text-[11px] cursor-pointer"
          title="Command Palette (⌘K)"
          aria-label="Open command palette"
        >
          <Search size={10} />
          <Command size={9} />
          <span className="text-[10px]">K</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="flex items-center justify-center bg-a26-glass text-a26-mid h-5 w-5.5 rounded-[5px] cursor-pointer border-none"
          title="Toggle Full Screen (⌃⌘F)"
          aria-label="Toggle full screen"
        >
          <Monitor size={10} />
        </button>
        <span className="text-a26-text text-xs font-normal">{time}</span>
      </div>
    </div>
  );
}
