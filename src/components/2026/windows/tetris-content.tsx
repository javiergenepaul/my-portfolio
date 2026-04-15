"use client";

import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "../hooks";
import { GameHighScorePanel } from "../components/game-high-score-panel";
import { isBetterScore, useGameHighScoresStore } from "@/stores";
import { translate, useLocaleRefresh } from "@/i18n";

// ── Board constants ────────────────────────────────────────────────────────────

const COLS = 10;
const ROWS = 20;

// ── Piece definitions ──────────────────────────────────────────────────────────

const COLORS: Record<string, string> = {
  I: "#00E5FF",
  O: "#FFD600",
  T: "#D500F9",
  S: "#00E676",
  Z: "#FF1744",
  J: "#2979FF",
  L: "#FF6D00",
};

// 4×4 spawn matrices (row 0 = top)
const BASE: Record<string, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  T: [
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  S: [
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  Z: [
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  L: [
    [0, 0, 1, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
};

// Pre-compute all 4 CW rotations for each piece
const rotateCW = (m: number[][]): number[][] => {
  const N = m.length;
  return Array.from({ length: N }, (_, r) =>
    Array.from({ length: N }, (_, c) => m[N - 1 - c][r]),
  );
};

const ROTS: Record<string, number[][][]> = {};
for (const t of Object.keys(BASE)) {
  const rs: number[][][] = [BASE[t]];
  for (let i = 1; i < 4; i++) rs.push(rotateCW(rs[i - 1]));
  ROTS[t] = rs;
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface Piece {
  type: string;
  rot: number;
  row: number;
  col: number;
}
type Board = (string | null)[][];

// ── Pure helpers ───────────────────────────────────────────────────────────────

const mkBoard = (): Board =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(null));

const cells = (p: Piece): [number, number][] => {
  const out: [number, number][] = [];
  ROTS[p.type][p.rot].forEach((row, r) =>
    row.forEach((v, c) => {
      if (v) out.push([p.row + r, p.col + c]);
    }),
  );
  return out;
};

const valid = (p: Piece, b: Board) =>
  cells(p).every(
    ([r, c]) => r >= 0 && r < ROWS && c >= 0 && c < COLS && !b[r]?.[c],
  );

const ghost = (p: Piece, b: Board): Piece => {
  let g = { ...p };
  while (valid({ ...g, row: g.row + 1 }, b)) g = { ...g, row: g.row + 1 };
  return g;
};

const spawn = (type: string): Piece => ({
  type,
  rot: 0,
  row: type === "I" ? -1 : 0,
  col: 3,
});

const LINE_PTS = [0, 100, 300, 500, 800];
const tickMs = (lv: number) => Math.max(50, 1000 - (lv - 1) * 90);

let _bag: string[] = [];
const pullBag = (): string => {
  if (!_bag.length) {
    _bag = ["I", "O", "T", "S", "Z", "J", "L"];
    for (let i = _bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [_bag[i], _bag[j]] = [_bag[j], _bag[i]];
    }
  }
  return _bag.pop()!;
};

// ── Component ──────────────────────────────────────────────────────────────────

export function TetrisContent() {
  useLocaleRefresh();
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const comboTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [cellSz, setCellSz] = useState(22);

  // Display state (drives UI re-renders)
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [combo, setCombo] = useState(0);
  const [nextT, setNextT] = useState("I");
  const [holdT, setHoldT] = useState<string | null>(null);
  const [comboBanner, setComboBanner] = useState<{
    title: string;
    detail: string;
    accent: string;
  } | null>(null);
  const [phase, setPhase] = useState<"idle" | "playing" | "paused" | "dead">(
    "idle",
  );
  const [runToken, setRunToken] = useState(0);
  const tetrisBest = useGameHighScoresStore(
    (state) => state.scores.tetris?.[0]?.value ?? null,
  );
  const isNewRecord =
    phase === "dead" && isBetterScore("tetris", score, tetrisBest);

  // Mutable game state (no re-renders on change)
  const gs = useRef({
    board: mkBoard(),
    piece: null as Piece | null,
    next: "I",
    hold: null as string | null,
    canHold: true,
    score: 0,
    level: 1,
    lines: 0,
    combo: 0,
    phase: "idle" as "idle" | "playing" | "paused" | "dead",
  });

  // actionsRef: functions updated every render so the interval always calls latest
  const act = useRef({
    draw: () => {},
    lock: () => {},
    move: (_dr: number, _dc: number) => false as boolean,
    rotate: () => {},
    drop: () => {},
    hold: () => {},
    sync: () => {},
  });

  // ── Draw ────────────────────────────────────────────────────────────────────

  act.current.draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    const g = gs.current;
    const cs = cellSz;
    const W = COLS * cs;
    const H = ROWS * cs;

    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let c = 1; c < COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cs, 0);
      ctx.lineTo(c * cs, H);
      ctx.stroke();
    }
    for (let r = 1; r < ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cs);
      ctx.lineTo(W, r * cs);
      ctx.stroke();
    }

    const drawCell = (r: number, c: number, color: string, alpha = 1) => {
      if (r < 0) return;
      ctx.globalAlpha = alpha;
      const x = c * cs,
        y = r * cs,
        pad = Math.max(1, cs * 0.06),
        rx = Math.max(2, cs * 0.14);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + pad, y + pad, cs - pad * 2, cs - pad * 2, rx);
      ctx.fill();
      // top gloss
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath();
      ctx.roundRect(
        x + pad + 1,
        y + pad + 1,
        cs - pad * 2 - 2,
        (cs - pad * 2) * 0.3,
        rx,
      );
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    // Board cells
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (g.board[r][c]) drawCell(r, c, g.board[r][c]!);

    // Ghost
    if (g.piece && g.phase === "playing") {
      const gh = ghost(g.piece, g.board);
      cells(gh).forEach(([r, c]) =>
        drawCell(r, c, COLORS[g.piece!.type], 0.15),
      );
    }

    // Active piece
    if (g.piece && g.phase === "playing")
      cells(g.piece).forEach(([r, c]) => drawCell(r, c, COLORS[g.piece!.type]));

    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
  };

  // ── Sync display state ──────────────────────────────────────────────────────

  act.current.sync = () => {
    const g = gs.current;
    setScore(g.score);
    setLevel(g.level);
    setLines(g.lines);
    setCombo(g.combo);
    setNextT(g.next);
    setHoldT(g.hold);
  };

  const showComboBanner = (streak: number, cleared: number, bonus: number) => {
    const tier = Math.min(Math.max(streak, 1), 5);
    const title = translate(`win26.tetrisUi.comboLabels.${tier}` as any);
    const detailParts = [
      translate("win26.tetrisUi.comboCount" as any, { count: streak }),
      translate("win26.tetrisUi.comboLines" as any, { count: cleared }),
    ];

    if (bonus > 0) {
      detailParts.push(
        translate("win26.tetrisUi.comboBonus" as any, { points: bonus }),
      );
    }

    const accentByTier = ["#D500F9", "#FF4FD8", "#FF7A18", "#FFD600", "#00E5FF"];
    setComboBanner({
      title,
      detail: detailParts.join(" • "),
      accent: accentByTier[tier - 1],
    });

    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    comboTimeoutRef.current = setTimeout(() => setComboBanner(null), 1350);
  };

  // ── Lock current piece ──────────────────────────────────────────────────────

  act.current.lock = () => {
    const g = gs.current;
    if (!g.piece) return;

    cells(g.piece).forEach(([r, c]) => {
      if (r >= 0) g.board[r][c] = COLORS[g.piece!.type];
    });

    // Clear full lines
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; ) {
      if (g.board[r].every((v) => v)) {
        g.board.splice(r, 1);
        g.board.unshift(Array(COLS).fill(null));
        cleared++;
      } else r--;
    }
    if (cleared) {
      const nextCombo = g.combo + 1;
      const comboBonus = nextCombo > 1 ? (nextCombo - 1) * 50 * g.level : 0;
      g.combo = nextCombo;
      g.score += LINE_PTS[cleared] * g.level + comboBonus;
      g.lines += cleared;
      g.level = Math.floor(g.lines / 10) + 1;
      showComboBanner(nextCombo, cleared, comboBonus);
    } else {
      g.combo = 0;
    }

    g.canHold = true;
    const next = spawn(g.next);
    g.next = pullBag();

    if (!valid(next, g.board)) {
      g.piece = null;
      g.phase = "dead";
      setPhase("dead");
    } else {
      g.piece = next;
    }
    act.current.draw();
    act.current.sync();
  };

  // ── Move ────────────────────────────────────────────────────────────────────

  act.current.move = (dr, dc) => {
    const g = gs.current;
    if (!g.piece) return false;
    const moved = { ...g.piece, row: g.piece.row + dr, col: g.piece.col + dc };
    if (valid(moved, g.board)) {
      g.piece = moved;
      act.current.draw();
      return true;
    }
    return false;
  };

  // ── Rotate (with simple wall kicks) ─────────────────────────────────────────

  act.current.rotate = () => {
    const g = gs.current;
    if (!g.piece) return;
    const newRot = (g.piece.rot + 1) % 4;
    for (const [dc, dr] of [
      [0, 0],
      [0, -1],
      [0, 1],
      [-1, 0],
      [0, -2],
      [0, 2],
    ]) {
      const c = {
        ...g.piece,
        rot: newRot,
        row: g.piece.row + dr,
        col: g.piece.col + dc,
      };
      if (valid(c, g.board)) {
        g.piece = c;
        act.current.draw();
        return;
      }
    }
  };

  // ── Hard drop ───────────────────────────────────────────────────────────────

  act.current.drop = () => {
    const g = gs.current;
    if (!g.piece) return;
    const gh = ghost(g.piece, g.board);
    g.score += (gh.row - g.piece.row) * 2;
    g.piece = gh;
    act.current.lock();
  };

  // ── Hold ────────────────────────────────────────────────────────────────────

  act.current.hold = () => {
    const g = gs.current;
    if (!g.piece || !g.canHold) return;
    const cur = g.piece.type;
    g.piece = spawn(g.hold ?? g.next);
    if (!g.hold) g.next = pullBag();
    g.hold = cur;
    g.canHold = false;
    if (!valid(g.piece, g.board)) {
      g.phase = "dead";
      setPhase("dead");
      return;
    }
    act.current.draw();
    act.current.sync();
  };

  // ── Game loop (16 ms poll; ticks based on level speed) ──────────────────────

  useEffect(() => {
    if (phase !== "playing") return;
    let last = performance.now();
    const id = setInterval(() => {
      if (gs.current.phase !== "playing") return;
      const now = performance.now();
      if (now - last >= tickMs(gs.current.level)) {
        last = now;
        if (!act.current.move(1, 0)) act.current.lock();
      }
    }, 16);
    return () => clearInterval(id);
  }, [phase]); // re-runs only when playing starts/stops

  // ── Keyboard ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const g = gs.current;
      if (g.phase !== "playing") return;
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          act.current.move(0, -1);
          break;
        case "ArrowRight":
          e.preventDefault();
          act.current.move(0, 1);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!act.current.move(1, 0)) act.current.lock();
          break;
        case "ArrowUp":
          e.preventDefault();
          act.current.rotate();
          break;
        case " ":
          e.preventDefault();
          act.current.drop();
          break;
        case "z":
        case "Z":
          act.current.rotate();
          break;
        case "c":
        case "C":
          act.current.hold();
          break;
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // ── Canvas resize ────────────────────────────────────────────────────────────

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const calc = () => {
      const padPanel = isMobile ? 0 : 128;
      const padControl = isMobile ? 140 : 0;
      const byW = Math.floor((el.clientWidth - padPanel - 8) / COLS);
      const byH = Math.floor((el.clientHeight - padControl - 8) / ROWS);
      setCellSz(Math.max(14, Math.min(byW, byH, 44)));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  useEffect(() => {
    const c = canvasRef.current;
    if (c) {
      c.width = COLS * cellSz;
      c.height = ROWS * cellSz;
    }
    act.current.draw();
  }, [cellSz]);

  useEffect(() => {
    return () => {
      if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    };
  }, []);

  // ── Start / restart ──────────────────────────────────────────────────────────

  const startGame = () => {
    setRunToken((token) => token + 1);
    _bag = []; // reset bag
    const g = gs.current;
    g.board = mkBoard();
    g.next = pullBag();
    g.piece = spawn(pullBag());
    g.hold = null;
    g.canHold = true;
    g.score = 0;
    g.level = 1;
    g.lines = 0;
    g.combo = 0;
    g.phase = "playing";
    setComboBanner(null);
    setPhase("playing");
    act.current.draw();
    act.current.sync();
  };

  const togglePause = () => {
    const g = gs.current;
    if (g.phase === "playing") {
      g.phase = "paused";
      setPhase("paused");
    } else if (g.phase === "paused") {
      g.phase = "playing";
      setPhase("playing");
    }
  };

  // ── Touch / swipe on canvas ──────────────────────────────────────────────────

  const tStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    tStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!tStart.current || gs.current.phase !== "playing") return;
    const t = e.changedTouches[0];
    const dx = t.clientX - tStart.current.x;
    const dy = t.clientY - tStart.current.y;
    const dt = Date.now() - tStart.current.t;
    tStart.current = null;
    const MIN = 22;
    if (Math.abs(dx) < MIN && Math.abs(dy) < MIN) {
      act.current.rotate();
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) {
      act.current.move(0, dx > 0 ? 1 : -1);
    } else if (dy > 0) {
      dt < 180 && dy > 55 ? act.current.drop() : act.current.move(1, 0);
    }
  };

  // ── Mini piece preview (for Next / Hold panels) ──────────────────────────────

  const MiniPiece = ({ type }: { type: string | null }) => {
    if (!type)
      return (
        <div
          style={{
            width: 60,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 18 }}>
            —
          </span>
        </div>
      );
    const mat = ROTS[type][0];
    const col = COLORS[type];
    // find bounding box to center
    const filled = mat.flatMap(
      (row, r) =>
        row
          .map((v, c) => (v ? ([r, c] as [number, number]) : null))
          .filter(Boolean) as [number, number][],
    );
    const minR = Math.min(...filled.map(([r]) => r));
    const maxR = Math.max(...filled.map(([r]) => r));
    const minC = Math.min(...filled.map(([, c]) => c));
    const maxC = Math.max(...filled.map(([, c]) => c));
    const sz = 11;
    const pw = (maxC - minC + 1) * sz;
    const ph = (maxR - minR + 1) * sz;
    return (
      <div
        style={{
          width: 60,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: pw, height: ph }}>
          {filled.map(([r, c]) => (
            <div
              key={`${r}-${c}`}
              style={{
                position: "absolute",
                left: (c - minC) * sz,
                top: (r - minR) * sz,
                width: sz - 1,
                height: sz - 1,
                background: col,
                borderRadius: 2,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.30)`,
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  // ── Btn helper for mobile controls ───────────────────────────────────────────

  const Btn = ({
    label,
    onPress,
    accent = false,
    wide = false,
  }: {
    label: string;
    onPress: () => void;
    accent?: boolean;
    wide?: boolean;
  }) => (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        onPress();
      }}
      style={{
        touchAction: "none",
        border: "none",
        cursor: "pointer",
        borderRadius: 9,
        background: accent ? "rgba(213,0,249,0.22)" : "rgba(255,255,255,0.07)",
        color: accent ? "#E040FB" : "rgba(255,255,255,0.72)",
        fontSize: 16,
        fontWeight: 700,
        height: 42,
        width: wide ? 80 : 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );

  // ── Idle screen ───────────────────────────────────────────────────────────────

  if (phase === "idle") {
    return (
      <div
        className="font-mac flex flex-col flex-1 min-h-0 items-center justify-center gap-5 p-6"
        style={{ background: "#080808" }}
      >
        <div className="text-center">
          <div style={{ fontSize: 48 }}>🟦</div>
          <div
            style={{
              color: "white",
              fontWeight: 700,
              fontSize: isMobile ? 20 : 24,
              marginTop: 8,
            }}
          >
            {translate("win26.games.tetris.name" as any)}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 11,
              marginTop: 6,
              lineHeight: 1.6,
            }}
          >
            {isMobile
              ? translate("win26.tetrisUi.instructionsMobile" as any)
              : translate("win26.tetrisUi.instructionsDesktop" as any)}
          </div>
          {!isMobile && (
            <div
              style={{
                color: "rgba(255,255,255,0.58)",
                fontSize: 12,
                fontWeight: 700,
                marginTop: 10,
                letterSpacing: "0.01em",
              }}
            >
              {translate("win26.tetrisUi.holdHint" as any)}
            </div>
          )}
        </div>
        <button
          onClick={startGame}
          style={{
            background: "#D500F9",
            color: "white",
            border: "none",
            borderRadius: 10,
            padding: "12px 36px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {translate("win26.gameUi.startGame" as any)}
        </button>
      </div>
    );
  }

  // ── Playing / Dead / Paused ───────────────────────────────────────────────────

  const PanelLabel = ({ children }: { children: string }) => (
    <div
      style={{
        color: "rgba(255,255,255,0.32)",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom: 4,
      }}
    >
      {children}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="font-mac flex flex-1 min-h-0 overflow-hidden"
      style={{
        background: "#080808",
        flexDirection: isMobile ? "column" : "row",
        gap: 8,
        padding: 8,
        alignItems: isMobile ? "center" : "stretch",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* Canvas area */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: isMobile ? "flex-start" : "center",
          flex: isMobile ? "none" : 1,
        }}
      >
        <div
          style={{
            position: "relative",
            touchAction: "none",
            userSelect: "none",
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <canvas
            ref={canvasRef}
            width={COLS * cellSz}
            height={ROWS * cellSz}
            style={{ display: "block" }}
          />

          {comboBanner && phase === "playing" && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: isMobile ? 12 : 18,
                transform: "translateX(-50%)",
                padding: isMobile ? "8px 12px" : "10px 14px",
                borderRadius: 14,
                border: `1px solid color-mix(in srgb, ${comboBanner.accent} 44%, transparent)`,
                background: "rgba(6,6,6,0.84)",
                boxShadow: `0 12px 24px color-mix(in srgb, ${comboBanner.accent} 22%, transparent)`,
                backdropFilter: "blur(10px)",
                textAlign: "center",
                pointerEvents: "none",
                minWidth: isMobile ? 150 : 180,
              }}
            >
              <div
                style={{
                  color: comboBanner.accent,
                  fontSize: isMobile ? 16 : 18,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {comboBanner.title}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.62)",
                  fontSize: isMobile ? 10 : 11,
                  marginTop: 4,
                  letterSpacing: "0.03em",
                }}
              >
                {comboBanner.detail}
              </div>
            </div>
          )}

          {/* Pause overlay */}
          {phase === "paused" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.82)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <div style={{ color: "white", fontWeight: 700, fontSize: 22 }}>
                {translate("win26.gameUi.paused" as any)}
              </div>
              <button
                onClick={togglePause}
                style={{
                  background: "#D500F9",
                  color: "white",
                  border: "none",
                  borderRadius: 9,
                  padding: "10px 24px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {translate("win26.gameUi.resume" as any)}
              </button>
              <button
                onClick={startGame}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.55)",
                  border: "none",
                  borderRadius: 9,
                  padding: "8px 20px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {translate("win26.gameUi.restart" as any)}
              </button>
            </div>
          )}

          {/* Game over overlay */}
          {phase === "dead" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.88)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: 16,
              }}
            >
              <div style={{ fontSize: 38 }}>💀</div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 20 }}>
                {translate("win26.gameUi.gameOver" as any)}
              </div>
              <div
                style={{
                  color: "#D500F9",
                  fontFamily: "monospace",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {score.toLocaleString()}
              </div>
              <div style={{ width: "100%", maxWidth: 320 }}>
                <GameHighScorePanel
                  scoreKey="tetris"
                  title={translate("win26.games.tetris.name" as any)}
                  accentColor="#D500F9"
                  currentValue={score}
                  currentDisplayValue={score.toLocaleString()}
                  runToken={runToken}
                  canSubmit={phase === "dead" && score > 0}
                  isRecord={isNewRecord}
                  note={translate("win26.tetrisUi.saveNote" as any)}
                />
              </div>
              <button
                onClick={startGame}
                style={{
                  background: "#D500F9",
                  color: "white",
                  border: "none",
                  borderRadius: 9,
                  padding: "10px 28px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  marginTop: 4,
                }}
              >
                {translate("win26.gameUi.playAgain" as any)}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Side panel — desktop */}
      {!isMobile && (
        <div
          style={{
            width: 112,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            flexShrink: 0,
          }}
        >
          {/* Hold */}
          <div>
            <PanelLabel>{translate("win26.gameUi.hold" as any)}</PanelLabel>
            <div
              style={{
                color: "rgba(255,255,255,0.42)",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginTop: -1,
                marginBottom: 6,
              }}
            >
              {translate("win26.tetrisUi.holdHint" as any)}
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 52,
              }}
            >
              <MiniPiece type={holdT} />
            </div>
          </div>

          {/* Next */}
          <div>
            <PanelLabel>{translate("win26.gameUi.next" as any)}</PanelLabel>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 52,
              }}
            >
              <MiniPiece type={nextT} />
            </div>
          </div>

          {/* Stats */}
          {[
            {
              label: translate("win26.gameUi.score" as any),
              val: score.toLocaleString(),
            },
            {
              label: translate("win26.gameUi.level" as any),
              val: String(level),
            },
            {
              label: translate("win26.gameUi.lines" as any),
              val: String(lines),
            },
            {
              label: translate("win26.tetrisUi.comboStat" as any),
              val: combo > 0 ? `x${combo}` : "-",
            },
          ].map(({ label, val }) => (
            <div key={label}>
              <PanelLabel>{label}</PanelLabel>
              <div
                style={{
                  color: "#D500F9",
                  fontFamily: "monospace",
                  fontSize: 20,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {val}
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <button
              onClick={togglePause}
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.55)",
                border: "none",
                borderRadius: 7,
                padding: "7px",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {phase === "paused" ? "Resume" : "Pause"}
            </button>
            <button
              onClick={startGame}
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.30)",
                border: "none",
                borderRadius: 7,
                padding: "7px",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Restart
            </button>
          </div>
        </div>
      )}

      {/* Mobile bottom controls */}
      {isMobile && (
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
            paddingInline: 8,
          }}
        >
          {/* Stats + hold/next */}
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                background: "rgba(255,255,255,0.04)",
                borderRadius: 8,
                padding: "6px 10px",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <PanelLabel>Hold</PanelLabel>
              <MiniPiece type={holdT} />
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                flex: 1,
                justifyContent: "center",
              }}
            >
              {[
                { label: "Score", val: score.toLocaleString() },
                { label: "Level", val: String(level) },
                { label: "Lines", val: String(lines) },
                {
                  label: translate("win26.tetrisUi.comboStat" as any),
                  val: combo > 0 ? `x${combo}` : "-",
                },
              ].map(({ label, val }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.30)",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.10em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      color: "#D500F9",
                      fontFamily: "monospace",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                background: "rgba(255,255,255,0.04)",
                borderRadius: 8,
                padding: "6px 10px",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <PanelLabel>Next</PanelLabel>
              <MiniPiece type={nextT} />
            </div>
          </div>

          {/* D-pad row */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Btn label="⟲" onPress={() => act.current.hold()} />
            <Btn label="◀" onPress={() => act.current.move(0, -1)} />
            <Btn label="↺" onPress={() => act.current.rotate()} accent />
            <Btn label="▶" onPress={() => act.current.move(0, 1)} />
            <Btn label="⬇" onPress={() => act.current.drop()} accent wide />
          </div>

          {/* Soft drop + pause */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <Btn label="▼" onPress={() => act.current.move(1, 0)} wide />
            <button
              onClick={togglePause}
              style={{
                border: "none",
                borderRadius: 9,
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.4)",
                fontSize: 11,
                fontWeight: 700,
                height: 42,
                width: 80,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {phase === "paused" ? "Resume" : "Pause"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
