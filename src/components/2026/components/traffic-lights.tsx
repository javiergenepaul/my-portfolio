"use client";

import { useState } from "react";
import { X, Minus, Maximize2 } from "lucide-react";

export function TrafficLights({
  onClose,
  onMinimize,
  onMaximize,
}: {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ display: "flex", gap: 8, alignItems: "center" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {[
        {
          bg: "#FF5F57",
          label: "Close",
          onClick: onClose,
          icon: <X size={7} color="rgba(0,0,0,0.55)" strokeWidth={2.5} />,
        },
        {
          bg: "#FFBD2E",
          label: "Minimize",
          onClick: onMinimize,
          icon: <Minus size={7} color="rgba(0,0,0,0.55)" strokeWidth={2.5} />,
        },
        {
          bg: "#28C840",
          label: "Maximize",
          onClick: onMaximize,
          icon: (
            <Maximize2 size={7} color="rgba(0,0,0,0.55)" strokeWidth={2.5} />
          ),
        },
      ].map((btn) => (
        <button
          key={btn.label}
          onClick={btn.onClick}
          aria-label={btn.label}
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: btn.bg,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {hov && btn.icon}
        </button>
      ))}
    </div>
  );
}
