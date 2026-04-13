"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { A, MAC_FONT } from "../constants";
import type { WinId } from "../constants";
import { hexRgb } from "../utils";
import { MacAppIcon } from "./mac-app-icons";

export function DesktopIcon({
  id,
  label,
  color,
  isOpen,
  onClick,
}: {
  id: WinId;
  label: string;
  color: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
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
        background: hov
          ? "rgba(255,255,255,0.09)"
          : isOpen
            ? `rgba(${hexRgb(color)},0.08)`
            : "transparent",
        cursor: "pointer",
        width: 84,
        outline: isOpen ? `1.5px solid rgba(${hexRgb(color)},0.38)` : "none",
        transition: "background 0.12s",
        fontFamily: MAC_FONT,
      }}
      aria-label={`Open ${label}`}
    >
      <motion.div
        whileHover={{ scale: 1.10, y: -2 }}
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
          textShadow: "0 1px 4px rgba(0,0,0,0.95)",
          background: "rgba(0,0,0,0.42)",
          borderRadius: 4,
          padding: "1px 6px",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {label}
      </span>
    </button>
  );
}
