"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useIsMobile } from "../hooks";
import { GameHighScorePanel } from "../components/game-high-score-panel";
import { isBetterScore, useGameHighScoresStore } from "@/stores";
import { translate, useLocaleRefresh } from "@/i18n";

const COLS = 13;
const ROWS = 11;
const BOMB_FUSE_MS = 1400;
const BLAST_MS = 380;
const ENEMY_STEP_MS = 260;

type Phase = "idle" | "playing" | "won" | "dead";
type Cell = "wall" | "crate" | "floor";
type Pos = { x: number; y: number };
type Bomb = Pos & { placedAt: number; power: number };
type Blast = Pos & { expiresAt: number };
type PowerUpType = "range" | "stock";
type PowerUp = Pos & { type: PowerUpType };

interface GameState {
  board: Cell[][];
  player: Pos;
  enemy: Pos | null;
  bombs: Bomb[];
  blasts: Blast[];
  powerUps: PowerUp[];
  exit: Pos;
  exitRevealed: boolean;
  phase: Phase;
  score: number;
  bombPower: number;
  bombCapacity: number;
}

const DIRS: Pos[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

const keyOf = ({ x, y }: Pos) => `${x},${y}`;

function cloneBoard(board: Cell[][]) {
  return board.map((row) => [...row]);
}

function buildBoard() {
  const board: Cell[][] = Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x) => {
      if (
        x === 0 ||
        y === 0 ||
        x === COLS - 1 ||
        y === ROWS - 1 ||
        (x % 2 === 0 && y % 2 === 0)
      ) {
        return "wall";
      }
      return "floor";
    }),
  );

  const safe = new Set(["1,1", "1,2", "2,1"]);
  const candidates: Pos[] = [];

  for (let y = 1; y < ROWS - 1; y++) {
    for (let x = 1; x < COLS - 1; x++) {
      if (board[y][x] !== "floor") continue;
      if (!safe.has(`${x},${y}`) && Math.random() < 0.62) {
        board[y][x] = "crate";
      }
      if (!safe.has(`${x},${y}`)) {
        candidates.push({ x, y });
      }
    }
  }

  const exit = candidates[Math.floor(Math.random() * candidates.length)] ?? {
    x: COLS - 2,
    y: ROWS - 2,
  };
  board[exit.y][exit.x] = "crate";

  const enemyCandidates = candidates.filter(
    (candidate) => candidate.x !== exit.x || candidate.y !== exit.y,
  );

  let enemy = enemyCandidates[Math.floor(Math.random() * enemyCandidates.length)] ?? {
    x: COLS - 2,
    y: 1,
  };
  while (Math.abs(enemy.x - 1) + Math.abs(enemy.y - 1) < 6) {
    enemy = enemyCandidates[Math.floor(Math.random() * enemyCandidates.length)] ?? enemy;
  }
  if (board[enemy.y][enemy.x] === "crate") board[enemy.y][enemy.x] = "floor";

  return { board, exit, enemy };
}

function createGame(): GameState {
  const { board, exit, enemy } = buildBoard();
  return {
    board,
    player: { x: 1, y: 1 },
    enemy,
    bombs: [],
    blasts: [],
    powerUps: [],
    exit,
    exitRevealed: false,
    phase: "idle",
    score: 0,
    bombPower: 2,
    bombCapacity: 1,
  };
}

function isOpenCell(board: Cell[][], pos: Pos) {
  return board[pos.y]?.[pos.x] === "floor";
}

function inBlast(pos: Pos | null, blasts: Blast[]) {
  if (!pos) return false;
  return blasts.some((blast) => blast.x === pos.x && blast.y === pos.y);
}

function hasClearedStage(state: GameState) {
  return (
    state.exitRevealed &&
    state.enemy === null &&
    state.player.x === state.exit.x &&
    state.player.y === state.exit.y
  );
}

export function BomberContent() {
  useLocaleRefresh();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(34);
  const [runToken, setRunToken] = useState(0);
  const [game, setGame] = useState<GameState>(() => createGame());
  const bomberBest = useGameHighScoresStore(
    (state) => state.scores.bomber?.[0]?.value ?? null,
  );
  const isNewRecord =
    game.phase === "won" && isBetterScore("bomber", game.score, bomberBest);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const calc = () => {
      const reservedH = isMobile ? 188 : 84;
      const byW = Math.floor((el.clientWidth - 20) / COLS);
      const byH = Math.floor((el.clientHeight - reservedH) / ROWS);
      const maxCell = isMobile ? 72 : 112;
      setCellSize(Math.max(20, Math.min(byW, byH, maxCell)));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  const resetGame = useCallback((autoStart = false) => {
    setRunToken((token) => token + 1);
    const next = createGame();
    next.phase = autoStart ? "playing" : "idle";
    setGame(next);
  }, []);

  const canMoveTo = useCallback((next: Pos, state: GameState) => {
    if (!isOpenCell(state.board, next)) return false;
    if (state.bombs.some((bomb) => bomb.x === next.x && bomb.y === next.y)) {
      return false;
    }
    return true;
  }, []);

  const triggerWinIfReady = useCallback((state: GameState) => {
    if (hasClearedStage(state)) {
      return {
        ...state,
        phase: "won" as const,
        score: state.score + 500,
      };
    }
    return state;
  }, []);

  const placeBomb = useCallback(() => {
    setGame((state) => {
      if (state.phase === "idle") {
        return { ...state, phase: "playing" };
      }
      if (state.phase !== "playing") return state;
      if (state.bombs.length >= state.bombCapacity) {
        return state;
      }
      if (state.bombs.some((bomb) => bomb.x === state.player.x && bomb.y === state.player.y)) {
        return state;
      }
      return {
        ...state,
        bombs: [
          ...state.bombs,
          {
            x: state.player.x,
            y: state.player.y,
            placedAt: Date.now(),
            power: state.bombPower,
          },
        ],
      };
    });
  }, []);

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      setGame((state) => {
        const nextPhase = state.phase === "idle" ? "playing" : state.phase;
        if (nextPhase !== "playing") return state;
        const nextPos = { x: state.player.x + dx, y: state.player.y + dy };
        if (!canMoveTo(nextPos, state)) {
          return nextPhase === state.phase ? state : { ...state, phase: nextPhase };
        }
        const picked = state.powerUps.find(
          (powerUp) => powerUp.x === nextPos.x && powerUp.y === nextPos.y,
        );
        const powerUps = picked
          ? state.powerUps.filter(
              (powerUp) => !(powerUp.x === picked.x && powerUp.y === picked.y),
            )
          : state.powerUps;
        const score = picked ? state.score + 120 : state.score;

        return triggerWinIfReady({
          ...state,
          phase: nextPhase,
          player: nextPos,
          powerUps,
          score,
          bombPower:
            picked?.type === "range"
              ? Math.min(state.bombPower + 1, 5)
              : state.bombPower,
          bombCapacity:
            picked?.type === "stock"
              ? Math.min(state.bombCapacity + 1, 4)
              : state.bombCapacity,
        });
      });
    },
    [canMoveTo, triggerWinIfReady],
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (game.phase === "won" || game.phase === "dead") return;
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        event.preventDefault();
        movePlayer(-1, 0);
      }
      if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        event.preventDefault();
        movePlayer(1, 0);
      }
      if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
        event.preventDefault();
        movePlayer(0, -1);
      }
      if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
        event.preventDefault();
        movePlayer(0, 1);
      }
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        placeBomb();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [game.phase, movePlayer, placeBomb]);

  useEffect(() => {
    if (game.phase !== "playing") return;
    const id = window.setInterval(() => {
      setGame((state) => {
        if (state.phase !== "playing") return state;
        const now = Date.now();
        let board = cloneBoard(state.board);
        const freshBlasts = state.blasts.filter((blast) => blast.expiresAt > now);
        let blasts = freshBlasts;
        let score = state.score;
        let exitRevealed = state.exitRevealed;
        let enemy = state.enemy;
        let phase: Phase = state.phase;
        let powerUps = [...state.powerUps];
        const survivingBombs: Bomb[] = [];

        const detonate = (bomb: Bomb) => {
          const cells = new Map<string, Blast>();
          const addBlast = (pos: Pos) => {
            cells.set(keyOf(pos), { ...pos, expiresAt: now + BLAST_MS });
          };
          addBlast(bomb);
          for (const dir of DIRS) {
            for (let step = 1; step <= bomb.power; step++) {
              const pos = { x: bomb.x + dir.x * step, y: bomb.y + dir.y * step };
              const tile = board[pos.y]?.[pos.x];
              if (!tile || tile === "wall") break;
              addBlast(pos);
              if (tile === "crate") {
                board[pos.y][pos.x] = "floor";
                score += 40;
                if (pos.x === state.exit.x && pos.y === state.exit.y) {
                  exitRevealed = true;
                } else if (!powerUps.some((powerUp) => powerUp.x === pos.x && powerUp.y === pos.y)) {
                  const dropRoll = Math.random();
                  const type =
                    dropRoll < 0.14
                      ? "range"
                      : dropRoll < 0.24
                        ? "stock"
                        : null;
                  if (type) {
                    powerUps.push({ x: pos.x, y: pos.y, type });
                  }
                }
                break;
              }
            }
          }
          blasts = [...blasts, ...cells.values()];
          if (enemy && cells.has(keyOf(enemy))) {
            enemy = null;
            score += 250;
          }
          if (cells.has(keyOf(state.player))) {
            phase = "dead";
          }
        };

        for (const bomb of state.bombs) {
          if (now - bomb.placedAt >= BOMB_FUSE_MS) detonate(bomb);
          else survivingBombs.push(bomb);
        }

        if (enemy && phase === "playing") {
          const options = DIRS.map((dir) => ({ x: enemy!.x + dir.x, y: enemy!.y + dir.y }))
            .filter((pos) => isOpenCell(board, pos))
            .filter((pos) => !survivingBombs.some((bomb) => bomb.x === pos.x && bomb.y === pos.y));
          if (options.length) {
            options.sort(
              (left, right) =>
                Math.abs(left.x - state.player.x) + Math.abs(left.y - state.player.y) -
                (Math.abs(right.x - state.player.x) + Math.abs(right.y - state.player.y)),
            );
            enemy = options[Math.random() < 0.72 ? 0 : Math.floor(Math.random() * options.length)];
          }
          if (enemy.x === state.player.x && enemy.y === state.player.y) {
            phase = "dead";
          }
        }

        if (inBlast(enemy, blasts)) enemy = null;
        if (inBlast(state.player, blasts)) phase = "dead";

        const next = triggerWinIfReady({
          ...state,
          board,
          bombs: survivingBombs,
          blasts,
          powerUps,
          enemy,
          exitRevealed,
          score,
          phase,
        });

        return next;
      });
    }, ENEMY_STEP_MS);
    return () => window.clearInterval(id);
  }, [game.phase, triggerWinIfReady]);

  const boardPx = useMemo(() => ({ width: COLS * cellSize, height: ROWS * cellSize }), [cellSize]);
  const activeBombCount = game.bombs.length;
  const nextBombMs =
    activeBombCount > 0
      ? Math.max(
          0,
          Math.min(
            ...game.bombs.map((bomb) => BOMB_FUSE_MS - (Date.now() - bomb.placedAt)),
          ),
        )
      : 0;
  const nextBombSeconds = (nextBombMs / 1000).toFixed(1);
  const bombStatusKey =
    activeBombCount === 0
      ? ("win26.bomberUi.bombReady" as any)
      : activeBombCount === 1
        ? ("win26.bomberUi.bombDroppedSingle" as any)
        : ("win26.bomberUi.bombDroppedMultiple" as any);
  const stockPowerUp = game.powerUps.find((powerUp) => powerUp.type === "stock") ?? null;
  const rangePowerUp = game.powerUps.find((powerUp) => powerUp.type === "range") ?? null;

  const renderCell = (x: number, y: number) => {
    const tile = game.board[y][x];
    const isPlayer = game.player.x === x && game.player.y === y;
    const isEnemy = game.enemy?.x === x && game.enemy?.y === y;
    const isBomb = game.bombs.some((bomb) => bomb.x === x && bomb.y === y);
    const isBlast = game.blasts.some((blast) => blast.x === x && blast.y === y);
    const isExit = game.exit.x === x && game.exit.y === y && game.exitRevealed;
    const powerUp = game.powerUps.find((item) => item.x === x && item.y === y);

    let background = "rgba(17,24,39,0.88)";
    if (tile === "wall") background = "#374151";
    if (tile === "crate") background = "#92400E";
    if (isExit) background = "#0F766E";
    if (isBlast) background = "#F97316";

    return (
      <div
        key={`${x}-${y}`}
        style={{
          width: cellSize,
          height: cellSize,
          background,
          borderRadius: Math.max(4, cellSize * 0.18),
          position: "relative",
          boxShadow:
            tile === "crate"
              ? "inset 0 2px 0 rgba(255,255,255,0.14)"
              : "inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {isExit && (
          <div style={{ position: "absolute", inset: "22%", borderRadius: 999, border: "2px solid rgba(255,255,255,0.75)" }} />
        )}
        {isBomb && (
          <div style={{ position: "absolute", inset: "18%", borderRadius: 999, background: "#111827", boxShadow: "inset 0 3px 0 rgba(255,255,255,0.16)" }} />
        )}
        {powerUp && !isBomb && !isBlast && !isPlayer && (
          <div
            style={{
              position: "absolute",
              inset: "20%",
              borderRadius: 10,
              background:
                powerUp.type === "range"
                  ? "linear-gradient(180deg, #FDE68A 0%, #F59E0B 100%)"
                  : "linear-gradient(180deg, #86EFAC 0%, #16A34A 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: powerUp.type === "range" ? "#78350F" : "#052E16",
              fontSize: Math.max(9, cellSize * 0.28),
              fontWeight: 900,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.10) inset",
            }}
          >
            {powerUp.type === "range" ? "🔥" : "+"}
          </div>
        )}
        {isEnemy && (
          <div style={{ position: "absolute", inset: "16%", borderRadius: 8, background: "#F43F5E", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: Math.max(10, cellSize * 0.34), fontWeight: 700 }}>
            ×
          </div>
        )}
        {isPlayer && (
          <div
            style={{
              position: "absolute",
              inset: "14%",
              borderRadius: 8,
              background: "linear-gradient(180deg, #93C5FD 0%, #1D4ED8 100%)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.08) inset",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "24%",
                top: "28%",
                width: "18%",
                height: "20%",
                borderRadius: "50%",
                background: "white",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "24%",
                top: "28%",
                width: "18%",
                height: "20%",
                borderRadius: "50%",
                background: "white",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "30%",
                top: "36%",
                width: "8%",
                height: "9%",
                borderRadius: "50%",
                background: "#1E3A8A",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "30%",
                top: "36%",
                width: "8%",
                height: "9%",
                borderRadius: "50%",
                background: "#1E3A8A",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "33%",
                right: "33%",
                bottom: "23%",
                height: "10%",
                border: "1.5px solid rgba(255,255,255,0.88)",
                borderTop: "none",
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomLeftRadius: 999,
                borderBottomRightRadius: 999,
              }}
            />
            {activeBombCount > 0 && game.phase === "playing" && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: "calc(100% + 6px)",
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.96)",
                  color: "#111827",
                  fontSize: Math.max(8, cellSize * 0.16),
                  fontWeight: 800,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  padding: `${Math.max(3, cellSize * 0.09)}px ${Math.max(6, cellSize * 0.16)}px`,
                  borderRadius: 999,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.28)",
                  pointerEvents: "none",
                  zIndex: 4,
                }}
              >
                {translate("win26.bomberUi.bubbleRun" as any, {
                  time: nextBombSeconds,
                } as any)}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "100%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: `${Math.max(4, cellSize * 0.08)}px solid transparent`,
                    borderRight: `${Math.max(4, cellSize * 0.08)}px solid transparent`,
                    borderTop: `${Math.max(5, cellSize * 0.1)}px solid rgba(255,255,255,0.96)`,
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (game.phase === "idle") {
    return (
      <div className="font-mac flex flex-col flex-1 min-h-0 items-center justify-center gap-5 p-6" style={{ background: "#0B0B0F" }}>
        <div className="text-center">
          <div style={{ fontSize: 48 }}>💣</div>
          <div style={{ color: "white", fontWeight: 700, fontSize: isMobile ? 20 : 24, marginTop: 8 }}>
            {translate("win26.games.bomber.name" as any)}
          </div>
          <div style={{ color: "rgba(255,255,255,0.42)", fontSize: 12, marginTop: 6, maxWidth: 360, lineHeight: 1.6 }}>
            {translate("win26.bomberUi.subtitle" as any)}
          </div>
        </div>
        <button
          onClick={() => resetGame(true)}
          style={{ background: "#F97316", color: "#111827", border: "none", borderRadius: 10, padding: "12px 34px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >
          {translate("win26.gameUi.startGame" as any)}
        </button>
        <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 11, textAlign: "center", maxWidth: 420 }}>
          {isMobile
            ? translate("win26.bomberUi.instructionsMobile" as any)
            : translate("win26.bomberUi.instructionsDesktop" as any)}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="font-mac flex flex-col flex-1 min-h-0 overflow-hidden"
      style={{
        background: "#0B0B0F",
        padding: isMobile ? "12px 10px 18px" : "14px 14px 20px",
        gap: 10,
      }}
    >
      <div className="flex items-center gap-3 w-full" style={{ maxWidth: boardPx.width }}>
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.30)" }}>
          {translate("win26.gameUi.score" as any)}
        </span>
        <span style={{ color: "#F97316", fontFamily: "monospace", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
          {game.score}
        </span>
        <div className="flex-1" />
        <button onClick={() => resetGame(true)} className="font-mac text-[11px] px-2.5 py-1 rounded-[6px] border-none cursor-pointer" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)" }}>
          {translate("win26.gameUi.restart" as any)}
        </button>
      </div>

      <div
        className="flex items-center justify-between gap-3 w-full flex-wrap"
        style={{ maxWidth: boardPx.width }}
      >
        <div
          className="flex items-center gap-2 rounded-full"
          style={{
            padding: isMobile ? "7px 10px" : "8px 12px",
            background:
              activeBombCount > 0
                ? "rgba(249,115,22,0.18)"
                : "rgba(255,255,255,0.06)",
            border:
              activeBombCount > 0
                ? "1px solid rgba(249,115,22,0.32)"
                : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: activeBombCount > 0 ? "#F97316" : "rgba(255,255,255,0.32)",
              boxShadow:
                activeBombCount > 0 ? "0 0 10px rgba(249,115,22,0.75)" : "none",
              flexShrink: 0,
            }}
          />
          <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>
            {translate(bombStatusKey, { count: activeBombCount } as any)}
          </span>
        </div>

        <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.54)", fontSize: 11 }}>
          <span>{translate("win26.bomberUi.bombFuse" as any)}</span>
          <span
            style={{
              color: activeBombCount > 0 ? "#FDBA74" : "rgba(255,255,255,0.36)",
              fontFamily: "monospace",
              fontSize: 14,
              fontWeight: 700,
              minWidth: 44,
              textAlign: "right",
            }}
          >
            {activeBombCount > 0 ? `${nextBombSeconds}s` : "--"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 w-full flex-wrap" style={{ maxWidth: boardPx.width }}>
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="flex items-center gap-2 rounded-full"
            style={{
              padding: isMobile ? "6px 9px" : "7px 11px",
              background: "rgba(245,158,11,0.14)",
              border: "1px solid rgba(245,158,11,0.20)",
            }}
          >
            <span style={{ fontSize: 12 }}>🔥</span>
            <span style={{ color: "rgba(255,255,255,0.84)", fontSize: 11, fontWeight: 700 }}>
              {translate("win26.bomberUi.rangePower" as any)} {game.bombPower}
            </span>
          </div>
          <div
            className="flex items-center gap-2 rounded-full"
            style={{
              padding: isMobile ? "6px 9px" : "7px 11px",
              background: "rgba(34,197,94,0.14)",
              border: "1px solid rgba(34,197,94,0.20)",
            }}
          >
            <span style={{ fontSize: 12 }}>💣</span>
            <span style={{ color: "rgba(255,255,255,0.84)", fontSize: 11, fontWeight: 700 }}>
              {translate("win26.bomberUi.stockPower" as any)} {game.bombCapacity}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end" style={{ color: "rgba(255,255,255,0.44)", fontSize: 11 }}>
          {rangePowerUp && (
            <span>{translate("win26.bomberUi.rangeDrop" as any)}</span>
          )}
          {stockPowerUp && (
            <span>{translate("win26.bomberUi.stockDrop" as any)}</span>
          )}
        </div>
      </div>

      <div
        className="flex-1 min-h-0 w-full flex"
        style={{
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "center",
        }}
      >
        <div className="relative shrink-0" style={{ ...boardPx }}>
          <div
            style={{
              width: boardPx.width,
              height: boardPx.height,
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
              gap: 2,
              padding: 2,
              borderRadius: 12,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            {Array.from({ length: ROWS }, (_, y) =>
              Array.from({ length: COLS }, (_, x) => renderCell(x, y)),
            ).flat()}
          </div>

          {(game.phase === "won" || game.phase === "dead") && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl px-4" style={{ background: "rgba(0,0,0,0.82)" }}>
              <div style={{ fontSize: 42 }}>{game.phase === "won" ? "🎉" : "💥"}</div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 20 }}>
                {translate(
                  game.phase === "won"
                    ? ("win26.bomberUi.cleared" as any)
                    : ("win26.gameUi.gameOver" as any),
                )}
              </div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, textAlign: "center", maxWidth: 320 }}>
                {translate(
                  game.phase === "won"
                    ? ("win26.bomberUi.winBody" as any)
                    : ("win26.bomberUi.loseBody" as any),
                )}
              </div>
              <div style={{ color: "#F97316", fontFamily: "monospace", fontSize: 24, fontWeight: 700 }}>
                {game.score}
              </div>
              <div style={{ width: "100%", maxWidth: 340 }}>
                <GameHighScorePanel
                  scoreKey="bomber"
                  title={translate("win26.games.bomber.name" as any)}
                  accentColor="#F97316"
                  currentValue={game.score}
                  currentDisplayValue={`${game.score}`}
                  runToken={runToken}
                  canSubmit={game.phase === "won" && game.score > 0}
                  isRecord={isNewRecord}
                  note={translate("win26.bomberUi.saveNote" as any)}
                />
              </div>
              <div className="flex gap-2 mt-1">
                <button onClick={() => resetGame(true)} className="font-mac text-[12px] px-4 py-1.5 rounded-[8px] border-none cursor-pointer font-semibold" style={{ background: "#F97316", color: "#111827" }}>
                  {translate("win26.gameUi.playAgain" as any)}
                </button>
                <button onClick={() => resetGame(false)} className="font-mac text-[12px] px-4 py-1.5 rounded-[8px] border-none cursor-pointer" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)" }}>
                  {translate("win26.gameUi.menu" as any)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isMobile ? (
        <div className="flex flex-col items-center gap-1 shrink-0" style={{ touchAction: "none" }}>
          <button onPointerDown={(e) => { e.preventDefault(); movePlayer(0, -1); }} className="font-mac flex items-center justify-center w-12 h-12 rounded-xl border-none cursor-pointer" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.72)", fontSize: 20 }}>▲</button>
          <div className="flex gap-1">
            <button onPointerDown={(e) => { e.preventDefault(); movePlayer(-1, 0); }} className="font-mac flex items-center justify-center w-12 h-12 rounded-xl border-none cursor-pointer" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.72)", fontSize: 20 }}>◀</button>
            <button onPointerDown={(e) => { e.preventDefault(); placeBomb(); }} className="font-mac flex items-center justify-center w-12 h-12 rounded-xl border-none cursor-pointer font-semibold" style={{ background: activeBombCount > 0 ? "rgba(249,115,22,0.34)" : "rgba(249,115,22,0.24)", color: "#FDBA74", fontSize: 18, boxShadow: activeBombCount > 0 ? "0 0 0 1px rgba(249,115,22,0.32) inset, 0 0 18px rgba(249,115,22,0.22)" : "none" }}>💣</button>
            <button onPointerDown={(e) => { e.preventDefault(); movePlayer(1, 0); }} className="font-mac flex items-center justify-center w-12 h-12 rounded-xl border-none cursor-pointer" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.72)", fontSize: 20 }}>▶</button>
          </div>
          <button onPointerDown={(e) => { e.preventDefault(); movePlayer(0, 1); }} className="font-mac flex items-center justify-center w-12 h-12 rounded-xl border-none cursor-pointer" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.72)", fontSize: 20 }}>▼</button>
        </div>
      ) : (
        <div className="text-[11px] text-center" style={{ color: "rgba(255,255,255,0.24)" }}>
          {translate("win26.bomberUi.instructionsDesktop" as any)}
        </div>
      )}
    </div>
  );
}