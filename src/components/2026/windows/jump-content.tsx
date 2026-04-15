"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "../hooks";
import { GameHighScorePanel } from "../components/game-high-score-panel";
import { isBetterScore, useGameHighScoresStore, type GameScoreKey } from "@/stores";
import { translate, useLocaleRefresh } from "@/i18n";

// ── Constants ──────────────────────────────────────────────────────────────────

const BASE_W = 320;
const BASE_H = 480;
const GRAVITY = 0.44;
const JUMP_VY = -11.8;
const PLAYER_W = 26;
const PLAYER_H = 30;
const PLAT_H = 10;
const PLAYER_SPD = 5.5;

// Hard mode: camera scrolls up at this base speed (px/frame), scales with score
const CAM_BASE_SPEED = 0.5;
const CAM_SPEED_SCALE = 0.003;

// ── Types ──────────────────────────────────────────────────────────────────────

interface Plat {
  x: number;
  y: number;
  w: number;
  hue: number;
  moving: boolean;
  dir: number;
  speed: number;
}

interface GS {
  vw: number;
  vh: number;
  px: number;
  py: number;
  pvx: number;
  pvy: number;
  camY: number;
  plats: Plat[];
  score: number;
  phase: "idle" | "playing" | "dead";
  difficulty: "easy" | "hard";
  isGrounded: boolean; // hard + desktop only
  isMobile: boolean; // captured at game start, used in loop
}

// ── Platform generation ────────────────────────────────────────────────────────

const HUES = [142, 38, 271, 22, 160, 245, 340];

function makePlat(x: number, y: number, w: number, score: number): Plat {
  const moving = score > 30 && Math.random() < 0.25;
  return {
    x,
    y,
    w,
    hue: HUES[Math.floor(Math.random() * HUES.length)],
    moving,
    dir: Math.random() < 0.5 ? 1 : -1,
    speed: 0.8 + Math.random() * 1.2,
  };
}

function genAbove(
  fromY: number,
  count: number,
  score: number,
  stageW: number,
): Plat[] {
  const out: Plat[] = [];
  let y = fromY;
  for (let i = 0; i < count; i++) {
    const gap = 56 + Math.random() * 38 + Math.min(score * 0.07, 28);
    y -= gap;
    const w = Math.max(38, 78 - score * 0.12);
    const x = Math.random() * Math.max(1, stageW - w);
    out.push(makePlat(x, y, w, score));
  }
  return out;
}

// ── Mobile button ──────────────────────────────────────────────────────────────

function MobileBtn({
  label,
  onDown,
  onUp,
}: {
  label: string;
  onDown: () => void;
  onUp: () => void;
}) {
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        onDown();
      }}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      style={{
        touchAction: "none",
        border: "none",
        borderRadius: 14,
        background: "rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.80)",
        fontSize: 22,
        fontWeight: 700,
        width: 80,
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export function JumpContent() {
  useLocaleRefresh();
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({
    scale: 1,
    stageW: BASE_W,
    stageH: BASE_H,
  });
  const [phase, setPhase] = useState<"idle" | "playing" | "dead">("idle");
  const [difficulty, setDifficulty] = useState<"easy" | "hard">("easy");
  const [score, setScore] = useState(0);
  const [runToken, setRunToken] = useState(0);
  const keys = useRef({ left: false, right: false, jumpPressed: false });
  const easyBest = useGameHighScoresStore(
    (state) => state.scores["jump-easy"]?.[0]?.value ?? 0,
  );
  const hardBest = useGameHighScoresStore(
    (state) => state.scores["jump-hard"]?.[0]?.value ?? 0,
  );

  const gs = useRef<GS>({
    vw: BASE_W,
    vh: BASE_H,
    px: BASE_W / 2 - PLAYER_W / 2,
    py: BASE_H - 120,
    pvx: 0,
    pvy: 0,
    camY: 0,
    plats: [],
    score: 0,
    phase: "idle",
    difficulty: "easy",
    isGrounded: false,
    isMobile: false,
  });

  // ── Scale canvas to container ─────────────────────────────────────────────

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const calc = () => {
      const avW = Math.max(220, el.clientWidth - 16);
      const avH = Math.max(
        300,
        isMobile ? el.clientHeight - 80 : el.clientHeight - 16,
      );
      const nextScale = Math.max(0.8, Math.min(avW / BASE_W, avH / BASE_H));
      const stageW = Math.max(BASE_W, Math.round(avW / nextScale));
      const stageH = Math.max(BASE_H, Math.round(avH / nextScale));
      gs.current.vw = stageW;
      gs.current.vh = stageH;
      setLayout({ scale: nextScale, stageW, stageH });
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  const { scale, stageW, stageH } = layout;
  const renderW = Math.round(stageW * scale);
  const renderH = Math.round(stageH * scale);

  // ── Keyboard ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const L = ["ArrowLeft", "a", "A"];
    const R = ["ArrowRight", "d", "D"];
    const dn = (e: KeyboardEvent) => {
      if (L.includes(e.key)) {
        e.preventDefault();
        keys.current.left = true;
      }
      if (R.includes(e.key)) {
        e.preventDefault();
        keys.current.right = true;
      }
      if (e.key === " ") {
        e.preventDefault();
        keys.current.jumpPressed = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      if (L.includes(e.key)) keys.current.left = false;
      if (R.includes(e.key)) keys.current.right = false;
    };
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", dn);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // ── Draw ──────────────────────────────────────────────────────────────────

  const draw = useCallback((ctx: CanvasRenderingContext2D, g: GS) => {
    const { vw, vh } = g;
    // Background — warmer tint in hard mode
    const bg = ctx.createLinearGradient(0, 0, 0, vh);
    if (g.difficulty === "hard") {
      bg.addColorStop(0, "#100408");
      bg.addColorStop(1, "#1e0608");
    } else {
      bg.addColorStop(0, "#04040f");
      bg.addColorStop(1, "#0e0620");
    }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, vw, vh);

    // Grid lines
    ctx.strokeStyle =
      g.difficulty === "hard"
        ? "rgba(200,60,60,0.05)"
        : "rgba(120,80,200,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < vw; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, vh);
      ctx.stroke();
    }
    for (let j = 0; j < vh; j += 32) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(vw, j);
      ctx.stroke();
    }

    // Height bands
    const bandH = 50 * 8;
    const firstBand = g.camY - (g.camY % bandH);
    for (let b = 0; b < 8; b++) {
      const worldY = firstBand + b * bandH;
      const sy = worldY - g.camY;
      if (sy < 0 || sy > vh) continue;
      const lv = Math.round(-worldY / bandH);
      ctx.strokeStyle =
        g.difficulty === "hard"
          ? "rgba(255,100,100,0.12)"
          : "rgba(160,120,255,0.12)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(vw, sy);
      ctx.stroke();
      ctx.setLineDash([]);
      if (lv > 0) {
        ctx.fillStyle =
          g.difficulty === "hard"
            ? "rgba(255,100,100,0.22)"
            : "rgba(160,120,255,0.22)";
        ctx.font = "9px system-ui";
        ctx.fillText(`× ${lv * 50}`, 4, sy - 3);
      }
    }

    // Platforms
    for (const p of g.plats) {
      const sy = p.y - g.camY;
      if (sy > vh + 20 || sy < -20) continue;

      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsl(${p.hue},85%,55%)`;
      ctx.fillStyle = `hsl(${p.hue},72%,38%)`;
      ctx.beginPath();
      ctx.roundRect(p.x, sy, p.w, PLAT_H, 5);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath();
      ctx.roundRect(p.x + 3, sy + 1.5, p.w - 6, 4, 3);
      ctx.fill();

      if (p.moving) {
        ctx.fillStyle = `hsla(${p.hue},90%,75%,0.65)`;
        ctx.font = "bold 8px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(p.dir > 0 ? "►" : "◄", p.x + p.w / 2, sy + 8);
        ctx.textAlign = "left";
      }
    }

    // Player
    const psx = g.px;
    const psy = g.py - g.camY;
    if (psy > -PLAYER_H && psy < vh + PLAYER_H) {
      ctx.shadowBlur = 18;
      ctx.shadowColor = g.isGrounded ? "#F87171" : "#60A5FA";

      const grad = ctx.createLinearGradient(psx, psy, psx, psy + PLAYER_H);
      grad.addColorStop(0, "#93C5FD");
      grad.addColorStop(1, "#1D4ED8");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(psx, psy, PLAYER_W, PLAYER_H, 7);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.ellipse(psx + 8, psy + 11, 3.5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(psx + PLAYER_W - 8, psy + 11, 3.5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      const pupilLean = g.pvx > 0.5 ? 1 : g.pvx < -0.5 ? -1 : 0;
      ctx.fillStyle = "#1e3a8a";
      ctx.beginPath();
      ctx.arc(psx + 8 + pupilLean, psy + 11.5, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(psx + PLAYER_W - 8 + pupilLean, psy + 11.5, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(
        psx + PLAYER_W / 2,
        psy + PLAYER_H * 0.62,
        5,
        0.15,
        Math.PI - 0.15,
      );
      ctx.stroke();

      // SPACE hint bubble when grounded (hard desktop)
      if (g.isGrounded && !g.isMobile) {
        ctx.fillStyle = "rgba(248,113,113,0.85)";
        ctx.font = "bold 8px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("SPACE", psx + PLAYER_W / 2, psy - 5);
        ctx.textAlign = "left";
      }
    }

    // HUD — score pill
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.roundRect(8, 8, 96, 26, 8);
    ctx.fill();
    ctx.fillStyle =
      g.difficulty === "hard"
        ? "rgba(248,113,113,0.9)"
        : "rgba(160,120,255,0.9)";
    ctx.font = "bold 11px system-ui";
    ctx.fillText(`⬆  ${g.score}`, 16, 25);

    // HUD — difficulty badge
    if (g.difficulty === "hard") {
      const badge = "● HARD";
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.beginPath();
      ctx.roundRect(vw - 62, 8, 54, 20, 6);
      ctx.fill();
      ctx.fillStyle = "rgba(248,113,113,0.9)";
      ctx.font = "bold 9px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(badge, vw - 10, 21);
      ctx.textAlign = "left";
    }
  }, []);

  // ── Start / Restart ───────────────────────────────────────────────────────

  const startGame = useCallback(
    (diff: "easy" | "hard") => {
      setRunToken((token) => token + 1);
      const g = gs.current;
      const startY = g.vh - 100;
      const first: Plat = {
        x: g.vw / 2 - 60,
        y: startY,
        w: 120,
        hue: 142,
        moving: false,
        dir: 1,
        speed: 1,
      };
      g.plats = [first, ...genAbove(startY, 50, 0, g.vw)];
      g.px = g.vw / 2 - PLAYER_W / 2;
      g.py = startY - PLAYER_H;
      g.pvx = 0;
      g.pvy = JUMP_VY;
      g.camY = 0;
      g.score = 0;
      g.phase = "playing";
      g.difficulty = diff;
      g.isGrounded = false;
      g.isMobile = isMobile;
      keys.current.jumpPressed = false;
      setDifficulty(diff);
      setPhase("playing");
      setScore(0);
    },
    [isMobile],
  );

  // ── Game loop ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf: number;
    const loop = () => {
      const g = gs.current;
      if (g.phase !== "playing") return;

      // Horizontal input
      if (keys.current.left) g.pvx = -PLAYER_SPD;
      else if (keys.current.right) g.pvx = PLAYER_SPD;
      else g.pvx *= 0.74;

      // Hard mode: apply space jump before physics (desktop only)
      if (g.difficulty === "hard" && !g.isMobile) {
        if (keys.current.jumpPressed && g.isGrounded) {
          g.pvy = JUMP_VY;
          g.isGrounded = false;
        }
        keys.current.jumpPressed = false; // consume every frame
      }

      // Reset grounded — collision check will restore it if still on platform
      if (g.difficulty === "hard" && !g.isMobile) {
        g.isGrounded = false;
      }

      // Update moving platforms
      for (const p of g.plats) {
        if (!p.moving) continue;
        p.x += p.dir * p.speed;
        if (p.x <= 0 || p.x + p.w >= g.vw) p.dir *= -1;
      }

      // Physics
      g.pvy += GRAVITY;
      g.px += g.pvx;
      g.py += g.pvy;

      // Wrap horizontally
      if (g.px + PLAYER_W < 0) g.px = g.vw;
      if (g.px > g.vw) g.px = -PLAYER_W;

      // Platform collision (falling, or grounded in hard desktop to stick to platform)
      const checkCollision =
        g.pvy >= 0 || (g.difficulty === "hard" && !g.isMobile && g.pvy === 0);
      if (checkCollision) {
        for (const p of g.plats) {
          const playerBottom = g.py + PLAYER_H;
          if (
            g.px + PLAYER_W > p.x + 2 &&
            g.px < p.x + p.w - 2 &&
            playerBottom >= p.y &&
            playerBottom <= p.y + PLAT_H + Math.abs(g.pvy) + 2
          ) {
            g.py = p.y - PLAYER_H;
            if (g.difficulty === "easy" || g.isMobile) {
              // Easy / mobile: auto-bounce
              g.pvy = JUMP_VY;
            } else {
              // Hard desktop: land and wait for Space
              g.pvy = 0;
              g.isGrounded = true;
            }
            break;
          }
        }
      }

      // Camera — hard mode auto-scrolls upward regardless of player position
      if (g.difficulty === "hard") {
        const camSpeed = CAM_BASE_SPEED + g.score * CAM_SPEED_SCALE;
        g.camY -= camSpeed;
      }

      // Camera — follow player if they go higher than the auto-scroll
      const targetCam = g.py - g.vh * 0.42;
      if (targetCam < g.camY) g.camY = targetCam;

      // Score
      const newScore = Math.max(0, Math.floor(-g.camY / 8));
      if (newScore > g.score) {
        g.score = newScore;
        setScore(newScore);
      }

      // Generate more platforms above the camera's top edge
      const topY = g.plats.length ? Math.min(...g.plats.map((p) => p.y)) : g.py;
      if (topY > g.camY + g.vh * 0.5) {
        g.plats.push(...genAbove(topY, 12, g.score, g.vw));
      }

      // Cull platforms far below
      g.plats = g.plats.filter((p) => p.y - g.camY < g.vh + 250);

      // Death — player fell below the visible screen bottom
      if (g.py - g.camY > g.vh + 100) {
        g.phase = "dead";
        setPhase("dead");
        draw(ctx, g);
        return;
      }

      draw(ctx, g);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, draw]);

  // ── Idle screen ───────────────────────────────────────────────────────────

  if (phase === "idle") {
    return (
      <div
        className="font-mac flex flex-col flex-1 min-h-0 items-center justify-center gap-6 p-6"
        style={{ background: "linear-gradient(to bottom, #04040f, #0e0620)" }}
      >
        <div className="text-center">
          <div style={{ fontSize: 52 }}>🏃</div>
          <div
            style={{
              color: "white",
              fontWeight: 700,
              fontSize: isMobile ? 20 : 24,
              marginTop: 8,
            }}
          >
            {translate("win26.games.jump.name" as any)}
          </div>
        </div>

        {/* Difficulty cards */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {/* Easy */}
          <button
            onClick={() => startGame("easy")}
            style={{
              background: "linear-gradient(135deg, #818CF8, #4F46E5)",
              color: "white",
              border: "none",
              borderRadius: 12,
              padding: "14px 28px",
              cursor: "pointer",
              textAlign: "left",
              minWidth: 130,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              {translate("win26.jumpUi.easy" as any)}
            </div>
            <div
              style={{
                fontSize: 10,
                opacity: 0.75,
                marginTop: 4,
                lineHeight: 1.6,
              }}
            >
              {isMobile
                ? translate("win26.jumpUi.easyMobile" as any)
                : translate("win26.jumpUi.easyDesktop" as any)}
            </div>
            {easyBest > 0 && (
              <div style={{ fontSize: 9, opacity: 0.5, marginTop: 4 }}>
                {translate("win26.gameUi.best" as any)}: {easyBest}
              </div>
            )}
          </button>

          {/* Hard */}
          <button
            onClick={() => startGame("hard")}
            style={{
              background: "linear-gradient(135deg, #F87171, #B91C1C)",
              color: "white",
              border: "none",
              borderRadius: 12,
              padding: "14px 28px",
              cursor: "pointer",
              textAlign: "left",
              minWidth: 130,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              {translate("win26.jumpUi.hard" as any)}
            </div>
            <div
              style={{
                fontSize: 10,
                opacity: 0.75,
                marginTop: 4,
                lineHeight: 1.6,
              }}
            >
              {isMobile
                ? translate("win26.jumpUi.hardMobile" as any)
                : translate("win26.jumpUi.hardDesktop" as any)}
            </div>
            {hardBest > 0 && (
              <div style={{ fontSize: 9, opacity: 0.5, marginTop: 4 }}>
                {translate("win26.gameUi.best" as any)}: {hardBest}
              </div>
            )}
          </button>
        </div>

        <div
          style={{
            color: "rgba(160,120,255,0.4)",
            fontSize: 10,
            textAlign: "center",
          }}
        >
          {translate("win26.jumpUi.movingPlatforms" as any)}
        </div>
      </div>
    );
  }

  // ── Playing / Dead ────────────────────────────────────────────────────────

  const scoreKey = `jump-${difficulty}` as GameScoreKey;
  const jumpBest = difficulty === "hard" ? hardBest : easyBest;
  const isNewRecord = phase === "dead" && isBetterScore(scoreKey, score, jumpBest);

  return (
    <div
      ref={containerRef}
      className="font-mac flex flex-col flex-1 min-h-0 items-center overflow-hidden"
      style={{
        background:
          difficulty === "hard"
            ? "linear-gradient(to bottom, #100408, #1e0608)"
            : "linear-gradient(to bottom, #04040f, #0e0620)",
        padding: 8,
        gap: 8,
        justifyContent: isMobile ? "flex-start" : "center",
      }}
    >
      {/* Canvas + overlay wrapper */}
      <div
        style={{
          position: "relative",
          width: renderW,
          height: renderH,
          maxWidth: "100%",
          maxHeight: "100%",
          flexShrink: 0,
        }}
      >
        <canvas
          ref={canvasRef}
          width={stageW}
          height={stageH}
          style={{
            display: "block",
            borderRadius: 10,
            width: renderW,
            height: renderH,
          }}
        />

        {/* Game-over overlay */}
        {phase === "dead" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 10,
              background: "rgba(0,0,0,0.84)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 40 }}>💀</div>
            <div style={{ color: "white", fontWeight: 700, fontSize: 20 }}>
              {translate("win26.gameUi.gameOver" as any)}
            </div>
            <div
              style={{
                color: difficulty === "hard" ? "#F87171" : "#818CF8",
                fontFamily: "monospace",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {score}
            </div>
            {jumpBest > 0 && (
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
                {translate("win26.gameUi.best" as any)}: {jumpBest}
              </div>
            )}
            <div style={{ width: "100%", maxWidth: 320 }}>
              <GameHighScorePanel
                scoreKey={scoreKey}
                title={translate("win26.jumpUi.titleWithDifficulty" as any, {
                  title: translate("win26.games.jump.name" as any),
                  difficulty: translate(
                    difficulty === "hard"
                      ? ("win26.jumpUi.hard" as any)
                      : ("win26.jumpUi.easy" as any),
                  ),
                })}
                accentColor={difficulty === "hard" ? "#F87171" : "#818CF8"}
                currentValue={score}
                currentDisplayValue={`${score}`}
                runToken={runToken}
                canSubmit={phase === "dead" && score > 0}
                isRecord={isNewRecord}
                note={translate("win26.jumpUi.saveNote" as any)}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button
                onClick={() => startGame(difficulty)}
                style={{
                  background:
                    difficulty === "hard"
                      ? "linear-gradient(135deg, #F87171, #B91C1C)"
                      : "linear-gradient(135deg, #818CF8, #4F46E5)",
                  color: "white",
                  border: "none",
                  borderRadius: 9,
                  padding: "10px 24px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {translate("win26.gameUi.playAgain" as any)}
              </button>
              <button
                onClick={() => setPhase("idle")}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.7)",
                  border: "none",
                  borderRadius: 9,
                  padding: "10px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {translate("win26.gameUi.menu" as any)}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile controls */}
      {isMobile && (
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            gap: 24,
            justifyContent: "center",
          }}
        >
          <MobileBtn
            label="◀"
            onDown={() => {
              keys.current.left = true;
            }}
            onUp={() => {
              keys.current.left = false;
            }}
          />
          <MobileBtn
            label="▶"
            onDown={() => {
              keys.current.right = true;
            }}
            onUp={() => {
              keys.current.right = false;
            }}
          />
        </div>
      )}
    </div>
  );
}
