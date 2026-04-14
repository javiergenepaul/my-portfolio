"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useIsDark } from "../use-aurora";
import type { WinId } from "../constants";
import { MacAppIcon } from "./mac-app-icons";

export function DesktopIcon({
  id,
  label,
  color,
  isOpen,
  x: initX,
  y: initY,
  constraintRef,
  onClick,
  onPositionChange,
  onContextMenu,
}: {
  id: WinId;
  label: string;
  color: string;
  isOpen: boolean;
  x: number;
  y: number;
  constraintRef: React.RefObject<HTMLElement | null>;
  onClick: () => void;
  onPositionChange: (x: number, y: number) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}) {
  const isDark = useIsDark();
  const [hov, setHov] = useState(false);
  const [dragging, setDragging] = useState(false);
  const wasDragged = useRef(false);

  const mx = useMotionValue(initX);
  const my = useMotionValue(initY);

  useEffect(() => {
    if (!dragging) animate(mx, initX, { type: "spring", stiffness: 380, damping: 28, mass: 0.7 });
  }, [initX]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!dragging) animate(my, initY, { type: "spring", stiffness: 380, damping: 28, mass: 0.7 });
  }, [initY]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={constraintRef}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        x: mx,
        y: my,
        zIndex: dragging ? 9000 : 10,
        touchAction: "none",
        userSelect: "none",
      }}
      onDragStart={() => { wasDragged.current = false; setDragging(true); }}
      onDrag={() => { wasDragged.current = true; }}
      onDragEnd={() => { setDragging(false); onPositionChange(mx.get(), my.get()); }}
    >
      <button
        onClick={() => { if (!wasDragged.current) onClick(); }}
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu?.(e); }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="font-mac flex flex-col items-center w-21 gap-1.25 py-2 px-2.5 rounded-lg border-none"
        style={{
          background: dragging
            ? `color-mix(in srgb, ${color} 14%, transparent)`
            : hov
              ? isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.06)"
              : isOpen
                ? `color-mix(in srgb, ${color} 8%, transparent)`
                : "transparent",
          cursor: dragging ? "grabbing" : "grab",
          outline: isOpen && !dragging ? `1.5px solid color-mix(in srgb, ${color} 38%, transparent)` : "none",
          boxShadow: dragging ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
          transition: dragging ? "none" : "background 0.12s, box-shadow 0.15s",
        }}
        aria-label={`Open ${label}`}
      >
        <motion.div
          animate={dragging ? { scale: 1.08, y: -4 } : { scale: 1, y: 0 }}
          whileHover={dragging ? {} : { scale: 1.10, y: -2 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
        >
          <MacAppIcon id={id} size={56} />
        </motion.div>
        <span
          className="text-a26-text text-center text-[11px] font-medium rounded pointer-events-none py-px px-1.5 leading-[1.4]"
          style={{
            textShadow: isDark ? "0 1px 4px rgba(0,0,0,0.95)" : "none",
            background: isDark ? "rgba(0,0,0,0.42)" : "rgba(255,255,255,0.72)",
          }}
        >
          {label}
        </span>
      </button>
    </motion.div>
  );
}
