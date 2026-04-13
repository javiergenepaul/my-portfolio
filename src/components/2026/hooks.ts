"use client";

import { useState, useEffect } from "react";

export function useTime() {
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
          hour12: true,
        }),
      );
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
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
  const [t, setT] = useState("");
  useEffect(() => {
    const upd = () =>
      setT(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}
