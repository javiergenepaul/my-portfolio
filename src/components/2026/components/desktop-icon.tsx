"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { A, MAC_FONT } from "../constants";
import { hexRgb } from "../utils";

export function DesktopIcon({
  label,
  icon,
  color,
  isOpen,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
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
        background: hov ? "rgba(255,255,255,0.07)" : "transparent",
        cursor: "pointer",
        width: 80,
        outline: isOpen ? `1px solid rgba(${hexRgb(color)},0.4)` : "none",
        transition: "background 0.12s",
        fontFamily: MAC_FONT,
      }}
      aria-label={`Open ${label}`}
    >
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 13,
          background: `linear-gradient(145deg, rgba(${hexRgb(color)},0.22), rgba(${hexRgb(color)},0.08))`,
          border: `1px solid rgba(${hexRgb(color)},0.28)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
          boxShadow: `0 6px 18px rgba(${hexRgb(color)},0.18), inset 0 1px 0 rgba(255,255,255,0.10)`,
        }}
      >
        {icon}
      </motion.div>
      <span
        style={{
          fontSize: 11,
          color: A.text,
          fontWeight: 500,
          textShadow: "0 1px 4px rgba(0,0,0,0.95)",
          background: "rgba(0,0,0,0.40)",
          borderRadius: 4,
          padding: "1px 5px",
        }}
      >
        {label}
      </span>
    </button>
  );
}
