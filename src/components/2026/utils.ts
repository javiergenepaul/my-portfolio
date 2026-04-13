"use client";

export function hexRgb(hex: string) {
  return `${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)}`;
}

export function formatDate(m: import("moment").Moment | "present") {
  return m === "present" ? "Present" : m.format("MMM YYYY");
}
