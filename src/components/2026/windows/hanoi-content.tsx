"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "../hooks";

// ── Constants ──────────────────────────────────────────────────────────────────

const DISC_COLORS = [
  "#60A5FA", // 1 smallest — blue
  "#34D399", // 2 — emerald
  "#FBBF24", // 3 — amber
  "#F97316", // 4 — orange
  "#F87171", // 5 — red
  "#C084FC", // 6 — violet
];

const DIFFICULTIES = [
  { label: "Easy",   discs: 3, sublabel: "7 moves min"  },
  { label: "Medium", discs: 4, sublabel: "15 moves min" },
  { label: "Hard",   discs: 5, sublabel: "31 moves min" },
  { label: "Expert", discs: 6, sublabel: "63 moves min" },
];

const PEG_LABELS = ["A", "B", "C"];
const BASE_H     = 5;  // base plate height px
const DRAG_THRESHOLD = 6; // px — move this far before ghost appears

// ── Types ──────────────────────────────────────────────────────────────────────

type Phase = "idle" | "playing" | "won";

interface DragState {
  fromPeg:  number;
  discSize: number;
  startX:   number;
  startY:   number;
  x:        number; // current pointer clientX
  y:        number; // current pointer clientY
  hovered:  number; // 0-2 — peg the ghost is over
  moved:    boolean; // true once ≥ DRAG_THRESHOLD px
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function initPegs(n: number): number[][] {
  return [Array.from({ length: n }, (_, i) => n - i), [], []];
}

const optimal = (n: number) => (1 << n) - 1;

// ── Component ──────────────────────────────────────────────────────────────────

export function HanoiContent() {
  const isMobile = useIsMobile();

  // Measure board width for responsive disc sizing
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardW, setBoardW] = useState(420);
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const calc = () => setBoardW(el.clientWidth);
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Game state ───────────────────────────────────────────────────────────────
  const [numDiscs, setNumDiscs] = useState(0);
  const [pegs,     setPegs]     = useState<number[][]>([[], [], []]);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves,    setMoves]    = useState(0);
  const [phase,    setPhase]    = useState<Phase>("idle");
  const [shake,    setShake]    = useState<number | null>(null);
  const [dragging, setDragging] = useState<DragState | null>(null);

  // ── Render-level refs — always current, no stale closures ────────────────────
  const pegsRef      = useRef(pegs);      pegsRef.current      = pegs;
  const numDiscsRef  = useRef(numDiscs);  numDiscsRef.current  = numDiscs;
  const selectedRef  = useRef(selected);  selectedRef.current  = selected;
  const phaseRef     = useRef(phase);     phaseRef.current     = phase;
  const draggingRef  = useRef(dragging);  draggingRef.current  = dragging;

  // ── Layout ───────────────────────────────────────────────────────────────────
  const DISC_H   = isMobile ? 17 : 21;
  const COL_W    = boardW / 3;
  const MAX_DISC = Math.min(COL_W * 0.86, 180);
  const MIN_DISC = Math.max(24, COL_W * 0.17);
  const PEG_H    = Math.max(1, numDiscs) * DISC_H + 64;
  const PEG_THICK = isMobile ? 4 : 5;

  const discWidth = (size: number) =>
    MIN_DISC + ((size - 1) / Math.max(numDiscsRef.current - 1, 1)) * (MAX_DISC - MIN_DISC);

  // ── Board helpers ─────────────────────────────────────────────────────────────

  /** Convert a viewport-X into a peg index 0-2. */
  const pegFromClientX = useCallback((clientX: number): number => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.max(0, Math.min(2, Math.floor((clientX - rect.left) / (rect.width / 3))));
  }, []);

  /** Can we move the top disc of `from` onto `to`? */
  const canDrop = useCallback((from: number, to: number): boolean => {
    const p = pegsRef.current;
    const disc = p[from].at(-1);
    if (disc === undefined) return false;
    const top = p[to].at(-1);
    return top === undefined || top > disc;
  }, []);

  // ── Core move logic (uses only refs — stale-closure safe) ────────────────────

  const executeMove = useCallback((fromPeg: number, toPeg: number) => {
    if (fromPeg === toPeg) return;
    const p        = pegsRef.current;
    const n        = numDiscsRef.current;
    const top      = p[fromPeg].at(-1);
    if (top === undefined) return;
    const target   = p[toPeg].at(-1);
    const valid    = target === undefined || target > top;

    if (valid) {
      const next = p.map((peg) => [...peg]);
      next[fromPeg].pop();
      next[toPeg].push(top);
      setPegs(next);
      setMoves((m) => m + 1);
      setSelected(null);
      if (next[2].length === n) setPhase("won");
    } else {
      setShake(toPeg);
      setTimeout(() => setShake(null), 380);
      setSelected(null);
    }
  }, []);

  // Click-to-select / click-to-place
  const handlePegClick = useCallback((pegIdx: number) => {
    if (phaseRef.current !== "playing") return;
    const sel = selectedRef.current;
    if (sel === null) {
      if (pegsRef.current[pegIdx].length > 0) setSelected(pegIdx);
    } else if (sel === pegIdx) {
      setSelected(null);
    } else {
      executeMove(sel, pegIdx);
    }
  }, [executeMove]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "1") handlePegClick(0);
      if (e.key === "2") handlePegClick(1);
      if (e.key === "3") handlePegClick(2);
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, handlePegClick]);

  // ── Drag — pointer events (mouse + touch) ─────────────────────────────────────

  /** Start a drag from the top disc of `fromPeg`. */
  const startDrag = useCallback((e: React.PointerEvent, fromPeg: number, discSize: number) => {
    if (phaseRef.current !== "playing") return;
    e.preventDefault();
    e.stopPropagation(); // don't also fire peg-click
    setSelected(null);
    setDragging({
      fromPeg, discSize,
      startX: e.clientX, startY: e.clientY,
      x: e.clientX, y: e.clientY,
      hovered: fromPeg,
      moved: false,
    });
  }, []);

  // Global listeners while dragging
  const isDragging = dragging !== null;
  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: PointerEvent) => {
      const d = draggingRef.current;
      if (!d) return;
      const moved = d.moved || Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > DRAG_THRESHOLD;
      const hovered = pegFromClientX(e.clientX);
      setDragging((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY, hovered, moved } : null);
    };

    const onUp = (e: PointerEvent) => {
      const d = draggingRef.current;
      if (!d) return;
      if (d.moved) {
        // Drop — execute move (or noop if same peg)
        executeMove(d.fromPeg, pegFromClientX(e.clientX));
      } else {
        // Tap on disc → treat as peg click (toggle select)
        handlePegClick(d.fromPeg);
      }
      setDragging(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   onUp);
    };
  }, [isDragging, pegFromClientX, executeMove, handlePegClick]);

  // Grabbing cursor while dragging
  useEffect(() => {
    if (dragging?.moved) {
      document.body.style.cursor = "grabbing";
      return () => { document.body.style.cursor = ""; };
    }
  }, [dragging?.moved]);

  // ── Actions ───────────────────────────────────────────────────────────────────

  const startGame = useCallback((n: number) => {
    setNumDiscs(n);
    setPegs(initPegs(n));
    setSelected(null);
    setMoves(0);
    setPhase("playing");
    setDragging(null);
  }, []);

  const restart = useCallback(() => {
    const n = numDiscsRef.current;
    setPegs(initPegs(n));
    setSelected(null);
    setMoves(0);
    setPhase("playing");
    setDragging(null);
  }, []);

  // ── Idle screen ───────────────────────────────────────────────────────────────

  if (phase === "idle") {
    return (
      <div
        className="font-mac flex flex-col flex-1 min-h-0 items-center justify-center gap-6 p-6"
        style={{ background: "#0D0D0D" }}
      >
        <div className="text-center">
          <div style={{ fontSize: isMobile ? 44 : 52 }}>🗼</div>
          <div className="text-white font-bold mt-2" style={{ fontSize: isMobile ? 20 : 24 }}>
            Tower of Hanoi
          </div>
          <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, marginTop: 4 }}>
            Move all discs from peg A to peg C
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full" style={{ maxWidth: 280 }}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.discs}
              onClick={() => startGame(d.discs)}
              className="font-mac flex items-center justify-between w-full px-4 py-3 rounded-[10px] border-none cursor-pointer transition-all duration-150"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background   = "rgba(192,132,252,0.12)";
                (e.currentTarget as HTMLElement).style.borderColor  = "rgba(192,132,252,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background   = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.borderColor  = "rgba(255,255,255,0.09)";
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.88)", fontWeight: 600, fontSize: 13 }}>
                {d.label}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-0.5">
                  {Array.from({ length: d.discs }, (_, i) => (
                    <div key={i} style={{ width: 4 + i * 3, height: 7, borderRadius: 2, background: DISC_COLORS[d.discs - 1 - i], opacity: 0.75 }} />
                  ))}
                </div>
                <span style={{ color: "rgba(255,255,255,0.32)", fontSize: 11 }}>{d.sublabel}</span>
              </div>
            </button>
          ))}
        </div>

        <div style={{ color: "rgba(255,255,255,0.20)", fontSize: 11, textAlign: "center" }}>
          {isMobile
            ? "Drag a disc onto another peg · or tap to pick up & place"
            : "Drag a disc · or click / press 1 2 3 to move"}
        </div>
      </div>
    );
  }

  // ── Playing / Won ─────────────────────────────────────────────────────────────

  const opt = optimal(numDiscs);

  return (
    <div
      className="font-mac flex flex-col flex-1 min-h-0"
      style={{ background: "#0D0D0D", padding: isMobile ? "12px 8px 16px" : "16px 12px 20px", gap: 12 }}
    >
      {/* Info bar */}
      <div className="flex items-center gap-3 shrink-0 px-1">
        <div className="flex items-center gap-1.5">
          <span style={{ color: "rgba(255,255,255,0.30)", fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" }}>Moves</span>
          <span style={{ color: "#C084FC", fontSize: 20, fontWeight: 700, fontFamily: "monospace", lineHeight: 1 }}>{moves}</span>
          <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 11 }}>/ {opt} optimal</span>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setPhase("idle")}
          className="font-mac text-[11px] px-2.5 py-1 rounded-[6px] border-none cursor-pointer"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}
        >Menu</button>
        <button
          onClick={restart}
          className="font-mac text-[11px] px-2.5 py-1 rounded-[6px] border-none cursor-pointer"
          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)" }}
        >Restart</button>
      </div>

      {/* Board */}
      <div
        ref={boardRef}
        className="flex-1 relative"
        style={{ minHeight: PEG_H + 30 }}
      >
        <div className="flex w-full absolute inset-0" style={{ alignItems: "flex-end", paddingBottom: 0 }}>
          {[0, 1, 2].map((pegIdx) => {
            const discs      = pegs[pegIdx];
            const isSelected = selected === pegIdx && !dragging;
            const isDragSrc  = dragging?.fromPeg === pegIdx;
            const isDragHov  = dragging?.moved && dragging.hovered === pegIdx;
            const dropValid  = isDragHov && canDrop(dragging!.fromPeg, pegIdx);
            const dropInvalid= isDragHov && !canDrop(dragging!.fromPeg, pegIdx) && dragging!.fromPeg !== pegIdx;

            // Column bg colour
            let colBg = "transparent";
            if (isSelected)   colBg = "rgba(192,132,252,0.07)";
            if (dropValid)    colBg = "rgba(74,222,128,0.08)";
            if (dropInvalid)  colBg = "rgba(248,113,113,0.08)";

            // Stick colour
            let stickCol = "rgba(255,255,255,0.12)";
            if (isSelected)   stickCol = "rgba(192,132,252,0.55)";
            if (dropValid)    stickCol = "rgba(74,222,128,0.45)";
            if (dropInvalid)  stickCol = "rgba(248,113,113,0.40)";

            return (
              <motion.div
                key={pegIdx}
                animate={shake === pegIdx ? { x: [-7, 7, -5, 5, -3, 3, 0] } : { x: 0 }}
                transition={{ duration: 0.38 }}
                onClick={() => { if (!dragging) handlePegClick(pegIdx); }}
                style={{
                  flex: 1,
                  cursor: phase === "playing" ? "pointer" : "default",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                }}
              >
                {/* Peg area */}
                <div style={{ position: "relative", width: "100%", height: PEG_H }}>
                  {/* Column background */}
                  <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: colBg, transition: "background 0.15s", pointerEvents: "none" }} />

                  {/* Peg stick */}
                  <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: BASE_H, width: PEG_THICK, height: PEG_H - BASE_H, background: stickCol, borderRadius: PEG_THICK, transition: "background 0.2s" }} />

                  {/* Base plate */}
                  <div style={{ position: "absolute", bottom: 0, left: "8%", right: "8%", height: BASE_H, background: isSelected ? "rgba(192,132,252,0.45)" : dropValid ? "rgba(74,222,128,0.35)" : "rgba(255,255,255,0.18)", borderRadius: BASE_H, transition: "background 0.2s" }} />

                  {/* Discs */}
                  {discs.map((size, i) => {
                    const isTop      = i === discs.length - 1;
                    const isLifted   = isSelected && isTop;
                    const isGhost    = isDragSrc && isTop && dragging!.moved; // hidden — shown as floating ghost
                    const color      = DISC_COLORS[(size - 1) % DISC_COLORS.length];
                    const w          = discWidth(size);

                    return (
                      <div
                        key={size}
                        onPointerDown={isTop ? (e) => startDrag(e, pegIdx, size) : undefined}
                        style={{
                          position: "absolute",
                          bottom: BASE_H + i * DISC_H,
                          left: "50%",
                          transform: `translateX(-50%) translateY(${isLifted ? -10 : 0}px)`,
                          width: w,
                          height: DISC_H - 3,
                          background: color,
                          borderRadius: (DISC_H - 3) * 0.42,
                          transition: isGhost ? "none" : "transform 0.18s ease, box-shadow 0.18s",
                          boxShadow: isLifted
                            ? `0 6px 20px ${color}88, 0 0 0 2px ${color}55`
                            : `0 1px 4px rgba(0,0,0,0.40)`,
                          opacity: isGhost ? 0 : 1,  // ghost hides the original
                          cursor: isTop && phase === "playing" ? (dragging ? "grabbing" : "grab") : "default",
                          zIndex: isTop ? 2 : 1,
                          touchAction: "none",
                        }}
                      />
                    );
                  })}

                  {/* Drop-here hint — visible when dragging a disc over an empty peg */}
                  {isDragHov && dragging!.fromPeg !== pegIdx && discs.length === 0 && (
                    <div style={{ position: "absolute", bottom: BASE_H + 8, left: "50%", transform: "translateX(-50%)", fontSize: 16, opacity: 0.35, pointerEvents: "none" }}>↓</div>
                  )}
                </div>

                {/* Peg label */}
                <div style={{ marginTop: 8, fontSize: isMobile ? 11 : 12, fontWeight: 700, letterSpacing: "0.10em", color: isSelected ? "#C084FC" : dropValid ? "#4ADE80" : dropInvalid ? "#F87171" : "rgba(255,255,255,0.28)", transition: "color 0.2s" }}>
                  {PEG_LABELS[pegIdx]}
                  {!isMobile && <span style={{ marginLeft: 4, opacity: 0.55, fontWeight: 400 }}>[{pegIdx + 1}]</span>}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Won overlay */}
        {phase === "won" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[10px]" style={{ background: "rgba(0,0,0,0.82)" }}>
            <div style={{ fontSize: isMobile ? 44 : 52 }}>🎉</div>
            <div className="text-white font-bold" style={{ fontSize: isMobile ? 18 : 22 }}>Solved!</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textAlign: "center" }}>
              {moves} moves
              {moves <= opt
                ? <span style={{ color: "#4ADE80", marginLeft: 6 }}>✓ optimal!</span>
                : <span style={{ color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>(best: {opt})</span>}
            </div>
            <div className="flex gap-2 mt-1">
              <button onClick={restart} className="font-mac text-[12px] px-4 py-1.5 rounded-[8px] border-none cursor-pointer font-semibold" style={{ background: "#C084FC", color: "#0A0A0A" }}>Play Again</button>
              <button onClick={() => setPhase("idle")} className="font-mac text-[12px] px-4 py-1.5 rounded-[8px] border-none cursor-pointer" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.60)" }}>Change Difficulty</button>
            </div>
          </div>
        )}
      </div>

      {/* Floating ghost disc — follows pointer during drag */}
      {dragging?.moved && (() => {
        const color = DISC_COLORS[(dragging.discSize - 1) % DISC_COLORS.length];
        const w     = discWidth(dragging.discSize);
        return (
          <div
            style={{
              position: "fixed",
              left: dragging.x - w / 2,
              top:  dragging.y - (DISC_H - 3) / 2,
              width: w,
              height: DISC_H - 3,
              background: color,
              borderRadius: (DISC_H - 3) * 0.42,
              boxShadow: `0 10px 32px ${color}99, 0 0 0 2px ${color}66`,
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 9999,
              transform: "rotate(-1.5deg) scale(1.08)",
            }}
          />
        );
      })()}

      {/* Hint */}
      {phase === "playing" && (
        <div className="shrink-0 text-center" style={{ color: "rgba(255,255,255,0.18)", fontSize: 11 }}>
          {dragging?.moved
            ? `Drop on peg ${PEG_LABELS[dragging.hovered]}`
            : selected !== null
            ? `Peg ${PEG_LABELS[selected]} selected — click another peg to place`
            : isMobile
            ? "Drag a disc · or tap a peg to pick up"
            : "Drag a disc · or click / press 1 2 3"}
        </div>
      )}
    </div>
  );
}
