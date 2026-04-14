"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const GRID = 20;
const CELL = 400 / GRID; // 20 px
const TICK_MS = 130;

type Pos = { x: number; y: number };
type Phase = "idle" | "playing" | "dead";

function randFood(snake: Pos[]): Pos {
  let f: Pos;
  do {
    f = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === f.x && s.y === f.y));
  return f;
}

const INIT_SNAKE: Pos[] = [{ x: 10, y: 11 }, { x: 10, y: 12 }, { x: 10, y: 13 }];

export function SnakeContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // All mutable game state lives in a ref to avoid stale closures in the tick
  const gs = useRef({
    snake: [...INIT_SNAKE],
    dir: { x: 0, y: -1 },
    nextDir: { x: 0, y: -1 },
    food: randFood(INIT_SNAKE),
    score: 0,
  });

  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  // ── Draw ──────────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const { snake, food } = gs.current;

    // Background
    ctx.fillStyle = "#0D0D0D";
    ctx.fillRect(0, 0, 400, 400);

    // Subtle grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let i = 1; i < GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, 400); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(400, i * CELL); ctx.stroke();
    }

    // Food
    ctx.fillStyle = "#F87171";
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL * 0.36, 0, Math.PI * 2);
    ctx.fill();
    // Food shine
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL * 0.38, food.y * CELL + CELL * 0.34, CELL * 0.14, 0, Math.PI * 2);
    ctx.fill();

    // Snake segments
    snake.forEach((seg, i) => {
      const ratio = i / Math.max(snake.length - 1, 1);
      const alpha = 1 - ratio * 0.55;
      ctx.fillStyle = i === 0
        ? `rgba(74,222,128,${alpha})`
        : `rgba(34,197,94,${alpha})`;
      const pad = 1.5;
      const x = seg.x * CELL + pad;
      const y = seg.y * CELL + pad;
      const w = CELL - pad * 2;
      const h = CELL - pad * 2;
      const rx = CELL * 0.3;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, rx);
      ctx.fill();
    });
  }, []);

  // ── Tick ──────────────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const g = gs.current;
    g.dir = g.nextDir;
    const head = g.snake[0];
    const nh = { x: head.x + g.dir.x, y: head.y + g.dir.y };

    const hitWall = nh.x < 0 || nh.x >= GRID || nh.y < 0 || nh.y >= GRID;
    const hitSelf = g.snake.some((p) => p.x === nh.x && p.y === nh.y);

    if (hitWall || hitSelf) {
      setPhase("dead");
      return;
    }

    const ate = nh.x === g.food.x && nh.y === g.food.y;
    g.snake = [nh, ...g.snake];
    if (!ate) {
      g.snake.pop();
    } else {
      g.food = randFood(g.snake);
      g.score += 10;
      setScore(g.score);
    }
    draw();
  }, [draw]);

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [phase, tick]);

  // Initial draw
  useEffect(() => { draw(); }, [draw]);

  // ── Restart ───────────────────────────────────────────────────────────────────
  const restart = useCallback((autoStart = false) => {
    const initSnake = [...INIT_SNAKE];
    gs.current = {
      snake: initSnake,
      dir: { x: 0, y: -1 },
      nextDir: { x: 0, y: -1 },
      food: randFood(initSnake),
      score: 0,
    };
    setScore(0);
    setPhase(autoStart ? "playing" : "idle");
    requestAnimationFrame(draw);
  }, [draw]);

  // ── Key handler — scoped to the container so it doesn't conflict with year nav ─
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKey = useCallback((e: KeyboardEvent) => {
    const MAP: Record<string, Pos> = {
      ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
    };
    const d = MAP[e.key];
    if (!d) return;
    e.preventDefault();
    e.stopPropagation();
    const g = gs.current;
    if (d.x === -g.dir.x && d.y === -g.dir.y) return;
    g.nextDir = d;
    setPhase((p) => p === "idle" ? "playing" : p);
  }, []);

  // Attach listener to the container element only — keys are ignored when blurred
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKey);
    return () => el.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Auto-focus on mount so the player doesn't need to click first
  useEffect(() => { containerRef.current?.focus(); }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="font-mac flex flex-col flex-1 min-h-0 items-center justify-center gap-3 p-4 outline-none"
      style={{ background: "#0D0D0D" }}
    >
      {/* Score bar */}
      <div className="flex items-center gap-3 w-full" style={{ maxWidth: 400 }}>
        <span
          className="text-[10px] font-bold tracking-[0.1em] uppercase"
          style={{ color: "rgba(255,255,255,0.30)" }}
        >
          Score
        </span>
        <span className="text-a26-green text-[20px] font-bold font-mono leading-none">
          {score}
        </span>
        <div className="flex-1" />
        <button
          onClick={() => restart(false)}
          className="font-mac text-[11px] px-2.5 py-1 rounded-[6px] border-none cursor-pointer"
          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)" }}
        >
          Restart
        </button>
      </div>

      {/* Canvas + overlays */}
      <div className="relative shrink-0" style={{ width: 400, height: 400 }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{
            display: "block",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        />

        {/* Start screen */}
        {phase === "idle" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 rounded-[8px]"
            style={{ background: "rgba(0,0,0,0.72)" }}
          >
            <span style={{ fontSize: 40 }}>🐍</span>
            <div className="text-white text-[16px] font-semibold">Snake</div>
            <div className="text-[12px]" style={{ color: "rgba(255,255,255,0.42)" }}>
              Press ↑ ↓ ← → or WASD to start
            </div>
          </div>
        )}

        {/* Game over */}
        {phase === "dead" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[8px]"
            style={{ background: "rgba(0,0,0,0.80)" }}
          >
            <span style={{ fontSize: 36 }}>💀</span>
            <div className="text-white text-[15px] font-semibold">Game Over</div>
            <div className="font-mono text-[14px]" style={{ color: "var(--a26-green)" }}>
              Score: {score}
            </div>
            <button
              onClick={() => restart(true)}
              className="font-mac text-[12px] px-5 py-1.5 rounded-[8px] border-none cursor-pointer font-semibold mt-1"
              style={{ background: "var(--a26-green)", color: "#0A0A0A" }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.20)" }}>
        ↑ ↓ ← → or W A S D to move
      </div>
    </div>
  );
}
