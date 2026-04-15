"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "../hooks";
import { GameHighScorePanel } from "../components/game-high-score-panel";
import { isBetterScore, useGameHighScoresStore } from "@/stores";

const GRID = 20;
const TICK_MS = 130;

type Pos = { x: number; y: number };
type Phase = "idle" | "playing" | "dead";

function randFood(snake: Pos[]): Pos {
  let f: Pos;
  do {
    f = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some((s) => s.x === f.x && s.y === f.y));
  return f;
}

const INIT_SNAKE: Pos[] = [
  { x: 10, y: 11 },
  { x: 10, y: 12 },
  { x: 10, y: 13 },
];

export function SnakeContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Responsive canvas size — fits the container width, max 400
  const [canvasSize, setCanvasSize] = useState(400);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const calc = () => {
      const available = el.clientWidth - (isMobile ? 24 : 32);
      const size = Math.min(Math.max(260, available), 400);
      setCanvasSize(size);
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  // Sync canvas element dimensions whenever canvasSize changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasSize]);

  const gs = useRef({
    snake: [...INIT_SNAKE],
    dir: { x: 0, y: -1 },
    nextDir: { x: 0, y: -1 },
    food: randFood(INIT_SNAKE),
    score: 0,
  });

  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [runToken, setRunToken] = useState(0);
  const snakeBest = useGameHighScoresStore(
    (state) => state.scores.snake?.[0]?.value ?? null,
  );
  const isNewRecord = phase === "dead" && isBetterScore("snake", score, snakeBest);

  // ── Draw ──────────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const SIZE = canvas.width;
    const CELL = SIZE / GRID;
    const { snake, food } = gs.current;

    ctx.fillStyle = "#0D0D0D";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let i = 1; i < GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(SIZE, i * CELL);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = "#F87171";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL + CELL / 2,
      food.y * CELL + CELL / 2,
      CELL * 0.36,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(
      food.x * CELL + CELL * 0.38,
      food.y * CELL + CELL * 0.34,
      CELL * 0.14,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    // Snake
    snake.forEach((seg, i) => {
      const ratio = i / Math.max(snake.length - 1, 1);
      const alpha = 1 - ratio * 0.55;
      ctx.fillStyle =
        i === 0 ? `rgba(74,222,128,${alpha})` : `rgba(34,197,94,${alpha})`;
      const pad = Math.max(1, CELL * 0.075);
      const rx = CELL * 0.3;
      ctx.beginPath();
      ctx.roundRect(
        seg.x * CELL + pad,
        seg.y * CELL + pad,
        CELL - pad * 2,
        CELL - pad * 2,
        rx,
      );
      ctx.fill();
    });
  }, []);

  // ── Tick ──────────────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const g = gs.current;
    g.dir = g.nextDir;
    const head = g.snake[0];
    const nh = { x: head.x + g.dir.x, y: head.y + g.dir.y };

    if (
      nh.x < 0 ||
      nh.x >= GRID ||
      nh.y < 0 ||
      nh.y >= GRID ||
      g.snake.some((p) => p.x === nh.x && p.y === nh.y)
    ) {
      setPhase("dead");
      return;
    }

    const ate = nh.x === g.food.x && nh.y === g.food.y;
    g.snake = [nh, ...g.snake];
    if (!ate) g.snake.pop();
    else {
      g.food = randFood(g.snake);
      g.score += 10;
      setScore(g.score);
    }
    draw();
  }, [draw]);

  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [phase, tick]);

  useEffect(() => {
    draw();
  }, [draw]);

  // ── Restart ───────────────────────────────────────────────────────────────────
  const restart = useCallback(
    (autoStart = false) => {
      setRunToken((token) => token + 1);
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
    },
    [draw],
  );

  // ── Steer (shared by keyboard + D-pad + swipe) ────────────────────────────────
  const steer = useCallback((d: Pos) => {
    const g = gs.current;
    if (d.x === -g.dir.x && d.y === -g.dir.y) return; // no 180°
    g.nextDir = d;
    setPhase((p) => (p === "idle" ? "playing" : p));
  }, []);

  // ── Keyboard ──────────────────────────────────────────────────────────────────
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const MAP: Record<string, Pos> = {
        ArrowUp: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
      };
      const dir = MAP[e.key];
      if (!dir) return;
      e.preventDefault();
      e.stopPropagation();
      steer(dir);
    },
    [steer],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKey);
    return () => el.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // ── Touch / swipe ─────────────────────────────────────────────────────────────
  const touchOrigin = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchOrigin.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchOrigin.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchOrigin.current.x;
      const dy = t.clientY - touchOrigin.current.y;
      touchOrigin.current = null;

      const MIN = 28;
      if (Math.abs(dx) < MIN && Math.abs(dy) < MIN) {
        // Tap — start game
        setPhase((p) => (p === "idle" ? "playing" : p));
        return;
      }
      if (Math.abs(dx) > Math.abs(dy)) {
        steer(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
      } else {
        steer(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
      }
    },
    [steer],
  );

  // ── D-pad button ──────────────────────────────────────────────────────────────
  const DPadBtn = ({ dir, label }: { dir: Pos; label: string }) => (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        steer(dir);
      }}
      className="font-mac flex items-center justify-center w-12 h-12 rounded-xl border-none cursor-pointer select-none active:scale-90 transition-transform duration-75"
      style={{
        background: "rgba(255,255,255,0.07)",
        color: "rgba(255,255,255,0.70)",
        fontSize: 20,
        WebkitUserSelect: "none",
        touchAction: "none",
      }}
      aria-label={label}
    >
      {label}
    </button>
  );

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="font-mac flex flex-col flex-1 min-h-0 items-center outline-none overflow-y-auto"
      style={{
        background: "#0D0D0D",
        gap: isMobile ? 12 : 12,
        padding: isMobile ? "12px 12px 20px" : "16px 16px 20px",
      }}
    >
      {/* Score bar */}
      <div
        className="flex items-center gap-3 w-full"
        style={{ maxWidth: canvasSize }}
      >
        <span
          className="text-[10px] font-bold tracking-widest uppercase"
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
          style={{
            background: "rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          Restart
        </button>
      </div>

      {/* Canvas */}
      <div
        className="relative shrink-0"
        style={{ width: canvasSize, height: canvasSize }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          style={{
            display: "block",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.07)",
            touchAction: "none",
          }}
        />

        {/* Start overlay */}
        {phase === "idle" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 rounded-[8px]"
            style={{ background: "rgba(0,0,0,0.72)" }}
          >
            <span style={{ fontSize: 40 }}>🐍</span>
            <div className="text-white text-[16px] font-semibold">GPM Snake</div>
            <div
              className="text-[12px] text-center px-4"
              style={{ color: "rgba(255,255,255,0.42)" }}
            >
              {isMobile
                ? "Tap or swipe to start"
                : "Press ↑ ↓ ← → or WASD to start"}
            </div>
          </div>
        )}

        {/* Game over overlay */}
        {phase === "dead" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[8px] px-4"
            style={{ background: "rgba(0,0,0,0.80)" }}
          >
            <span style={{ fontSize: 36 }}>💀</span>
            <div className="text-white text-[15px] font-semibold">
              Game Over
            </div>
            <div
              className="font-mono text-[14px]"
              style={{ color: "var(--a26-green)" }}
            >
              Score: {score}
            </div>
            <div style={{ width: "100%", maxWidth: 320 }}>
              <GameHighScorePanel
                scoreKey="snake"
                title="GPM Snake"
                accentColor="var(--a26-green)"
                currentValue={score}
                currentDisplayValue={`${score} pts`}
                runToken={runToken}
                canSubmit={phase === "dead" && score > 0}
                isRecord={isNewRecord}
                note="Save your run after a game over."
              />
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

      {/* D-pad — always visible on mobile, hint text on desktop */}
      {isMobile ? (
        <div
          className="flex flex-col items-center gap-1 shrink-0"
          style={{ touchAction: "none" }}
        >
          <DPadBtn dir={{ x: 0, y: -1 }} label="▲" />
          <div className="flex gap-1">
            <DPadBtn dir={{ x: -1, y: 0 }} label="◀" />
            <div className="w-12 h-12" />
            <DPadBtn dir={{ x: 1, y: 0 }} label="▶" />
          </div>
          <DPadBtn dir={{ x: 0, y: 1 }} label="▼" />
        </div>
      ) : (
        <div
          className="text-[11px]"
          style={{ color: "rgba(255,255,255,0.20)" }}
        >
          ↑ ↓ ← → or W A S D to move
        </div>
      )}
    </div>
  );
}
