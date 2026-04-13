"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { MAC_FONT } from "../constants";
import { useAurora, useIsDark } from "../use-aurora";
import type { WinId } from "../constants";
import { hexRgb } from "../utils";
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
  const A = useAurora();
  const isDark = useIsDark();
  const [hov, setHov] = useState(false);
  const [dragging, setDragging] = useState(false);
  const wasDragged = useRef(false);

  const mx = useMotionValue(initX);
  const my = useMotionValue(initY);

  // Sync motion values when the parent updates positions (e.g. after mount correction
  // or Arrange Icons / Reset Position). Skip update while the user is dragging.
  useEffect(() => {
    if (!dragging) mx.set(initX);
  }, [initX]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!dragging) my.set(initY);
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
      onDragStart={() => {
        wasDragged.current = false;
        setDragging(true);
      }}
      onDrag={() => {
        wasDragged.current = true;
      }}
      onDragEnd={() => {
        setDragging(false);
        onPositionChange(mx.get(), my.get());
      }}
    >
      <button
        onClick={() => { if (!wasDragged.current) onClick(); }}
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu?.(e); }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 5,
          padding: "8px 10px",
          borderRadius: 8,
          border: "none",
          background: dragging
            ? `rgba(${hexRgb(color)},0.14)`
            : hov
              ? isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.06)"
              : isOpen
                ? `rgba(${hexRgb(color)},0.08)`
                : "transparent",
          cursor: dragging ? "grabbing" : "grab",
          width: 84,
          outline: isOpen && !dragging ? `1.5px solid rgba(${hexRgb(color)},0.38)` : "none",
          boxShadow: dragging ? "0 8px 24px rgba(0,0,0,0.35)" : "none",
          transition: dragging ? "none" : "background 0.12s, box-shadow 0.15s",
          fontFamily: MAC_FONT,
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
          style={{
            fontSize: 11,
            color: A.text,
            fontWeight: 500,
            textShadow: isDark ? "0 1px 4px rgba(0,0,0,0.95)" : "none",
            background: isDark ? "rgba(0,0,0,0.42)" : "rgba(255,255,255,0.72)",
            borderRadius: 4,
            padding: "1px 6px",
            textAlign: "center",
            lineHeight: 1.4,
            pointerEvents: "none",
          }}
        >
          {label}
        </span>
      </button>
    </motion.div>
  );
}
