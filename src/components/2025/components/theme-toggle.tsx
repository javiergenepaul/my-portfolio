"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";

export function ThemeToggle() {
  const { theme, setTheme } = useSettingsStore();
  const OPTS = [
    { value: "light", Icon: Sun },
    { value: "system", Icon: Monitor },
    { value: "dark", Icon: Moon },
  ] as const;
  return (
    <div
      role="group"
      aria-label="Color theme"
      style={{
        display: "flex",
        gap: "2px",
        padding: "3px",
        backgroundColor: "#1C0510",
        borderRadius: "8px",
        border: "1px solid #2A0910",
      }}
    >
      {OPTS.map(({ value, Icon }) => {
        const on = theme === value;
        return (
          <motion.button
            key={value}
            onClick={() => setTheme(value)}
            whileTap={{ scale: 0.92 }}
            aria-label={`${value.charAt(0).toUpperCase() + value.slice(1)} theme`}
            aria-pressed={on}
            title={value.charAt(0).toUpperCase() + value.slice(1)}
            style={{
              width: "26px",
              height: "22px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: on ? "#E11D48" : "transparent",
              color: on ? "#fff" : "#94A3B8",
              transition: "background-color 0.15s, color 0.15s",
            }}
          >
            <Icon size={11} />
          </motion.button>
        );
      })}
    </div>
  );
}
