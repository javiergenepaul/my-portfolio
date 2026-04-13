"use client";

import { useState, useEffect } from "react";
import { use2026Settings } from "./settings-store";

export function useTime() {
  const timeFormat = use2026Settings((s) => s.timeFormat);
  const [t, setT] = useState("");
  useEffect(() => {
    const upd = () =>
      setT(
        new Date().toLocaleTimeString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: timeFormat === "12h",
        }),
      );
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, [timeFormat]);
  return t;
}

export function useSystemDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const h = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return dark;
}

export function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const chk = () => setM(window.innerWidth < 1024);
    chk();
    window.addEventListener("resize", chk);
    return () => window.removeEventListener("resize", chk);
  }, []);
  return m;
}

export function useMobileTime() {
  const timeFormat = use2026Settings((s) => s.timeFormat);
  const [t, setT] = useState("");
  useEffect(() => {
    const upd = () =>
      setT(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: timeFormat === "12h",
        }),
      );
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, [timeFormat]);
  return t;
}
