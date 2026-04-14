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
  return <div style={{ height: 1, background: "rgba(255,255,255,0.10)", margin: "4px 0" }} />;
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
      className="font-mac flex items-center w-full text-left relative whitespace-nowrap"
      style={{
        padding: "5px 12px 5px 26px",
        border: "none",
        background: hov && !disabled ? "var(--a26-glass)" : "transparent",
        borderRadius: 5,
        color: disabled ? "var(--a26-text-muted)" : "var(--a26-text)",
        fontSize: 13,
        cursor: disabled ? "default" : "pointer",
        gap: 0,
      }}
    >
      {checked && (
        <span className="absolute text-a26-teal" style={{ left: 9, fontSize: 11 }}>✓</span>
      )}
      <span style={{ flex: 1 }}>{label}</span>
      {shortcut && (
        <span className="text-a26-muted font-mac" style={{ fontSize: 12, marginLeft: 20 }}>
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
      className="bg-a26-window border border-a26-window-border"
      style={{
        position: "absolute",
        top: "calc(100% + 2px)",
        left: 0,
        minWidth: 220,
        borderRadius: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,0.40), 0 2px 8px rgba(0,0,0,0.30)",
        backdropFilter: "blur(24px)",
        padding: "4px 6px",
        zIndex: 9999,
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

  const menuBtnStyle = (id: MenuId): React.CSSProperties => ({
    height: 28,
    padding: "0 9px",
    background: activeMenu === id ? "rgba(255,255,255,0.14)" : "transparent",
    borderRadius: 4,
    border: "none",
    color: activeMenu === id ? "var(--a26-text)" : "var(--a26-text-mid)",
    fontSize: 13,
    cursor: "pointer",
  });

  return (
    <div
      ref={barRef}
      className="font-mac bg-a26-menu-bar border-b border-a26-menu-border select-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        height: 28,
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
      }}
    >
      {/* Left side */}
      <div className="flex items-center flex-1" style={{ gap: 0 }}>
        {/* Logo */}
        <div className="flex items-center" style={{ padding: "0 8px", height: 28 }}>
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

        <span className="text-a26-text" style={{ fontSize: 13, fontWeight: 600, padding: "0 8px" }}>
          GPM
        </span>

        {/* File */}
        <div className="relative">
          <button onClick={() => toggle("file")} className="font-mac" style={menuBtnStyle("file")}>File</button>
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
          <button onClick={() => toggle("view")} className="font-mac" style={menuBtnStyle("view")}>View</button>
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
          <button onClick={() => toggle("go")} className="font-mac" style={menuBtnStyle("go")}>Go</button>
          {activeMenu === "go" && (
            <Dropdown>
              {WIN_DEFS.map((def, i) => (
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
          <button onClick={() => toggle("window")} className="font-mac" style={menuBtnStyle("window")}>Window</button>
          {activeMenu === "window" && (
            <Dropdown>
              <MenuItem label="Cycle Windows" shortcut="⌃`" disabled={!anyOpen} onClick={() => act(() => {})} />
              <Separator />
              <MenuItem label="Minimize All" shortcut="⌘M" disabled={!anyOpen} onClick={() => act(onMinimizeAll)} />
              <MenuItem label="Restore All" disabled={!anyMinimized} onClick={() => act(onRestoreAll)} />
              <Separator />
              {WIN_DEFS.map((def) => (
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
      <div className="flex items-center" style={{ gap: 6 }}>
        <button
          onClick={onCmdK}
          className="font-mac flex items-center bg-a26-glass border border-a26-glass-border text-a26-mid"
          style={{ height: 20, padding: "0 7px", gap: 4, borderRadius: 5, fontSize: 11, cursor: "pointer" }}
          title="Command Palette (⌘K)"
          aria-label="Open command palette"
        >
          <Search size={10} />
          <Command size={9} />
          <span style={{ fontSize: 10 }}>K</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="flex items-center justify-center bg-a26-glass border border-a26-glass-border text-a26-mid"
          style={{ height: 20, width: 22, borderRadius: 5, border: "none", cursor: "pointer" }}
          title="Toggle Full Screen (⌃⌘F)"
          aria-label="Toggle full screen"
        >
          <Monitor size={10} />
        </button>
        <span className="text-a26-text" style={{ fontSize: 12, fontWeight: 400 }}>{time}</span>
      </div>
    </div>
  );
}
