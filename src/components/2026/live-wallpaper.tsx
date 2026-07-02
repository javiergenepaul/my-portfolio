"use client";

/**
 * LiveWallpaper — Kawasaki Ninja 500 (rainy night scene)
 *
 * Base    : /wallpapers/kawasaki-ninja-500.jpg — cover-fill, anchored at 72%
 * Overlay : multi-layer rain system, bokeh shimmer, ground splashes,
 *           rain mist, vignette, live clock widget
 */

import { useEffect, useRef } from "react";
import { getGpmTunesVisualizerState } from "./gpmtunes-audio";

// ── Types ─────────────────────────────────────────────────────────────────────
type Drop = {
  x: number;
  y: number;
  len: number; // streak length px
  spd: number; // px per frame
  w: number; // stroke width px
  op: number; // peak opacity
  wx: number; // per-drop wind-x offset (for organic angle variation)
};

type Splash = {
  x: number;
  y: number;
  r: number; // current radius
  maxR: number;
  op: number;
  age: number; // frames elapsed
  life: number; // total frames
};

type Bokeh = {
  x: number;
  y: number;
  r: number;
  rgb: readonly [number, number, number];
  op: number;
  phase: number;
};

// ── Clock widget ───────────────────────────────────────────────────────────────
function drawClock(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  fs: number,
  now: Date,
  beat: { isPlaying: boolean; level: number; bins: number[] },
) {
  const DAYS = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const MONTHS = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.95)";
  ctx.shadowBlur = 14;

  ctx.font = `700 ${Math.round(fs * 1.05)}px 'Inter','Segoe UI',sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillText(DAYS[now.getDay()], ox, oy);

  ctx.font = `400 ${Math.round(fs * 0.52)}px 'Inter','Segoe UI',sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.fillText(
    `${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
    ox,
    oy + fs * 0.8,
  );

  const cr = fs * 1.3;
  const cx = ox + cr;
  const cy = oy + fs * 2.45;

  if (beat.isPlaying) {
    const ringRadius = cr * 1.62;
    const minBar = fs * 0.14;
    const maxBar = fs * 0.82;
    const barCount = Math.min(beat.bins.length, 48);

    ctx.save();
    ctx.lineCap = "round";
    ctx.shadowColor = `rgba(255,255,255,${0.16 + beat.level * 0.34})`;
    ctx.shadowBlur = 10 + beat.level * 16;

    for (let i = 0; i < barCount; i += 1) {
      const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
      const normalized = beat.bins[i] ?? 0;
      const barLength = minBar + normalized * maxBar + beat.level * fs * 0.1;
      const innerRadius = ringRadius - fs * 0.14;
      const outerRadius = innerRadius + barLength;
      const alpha = 0.2 + normalized * 0.58 + beat.level * 0.1;

      ctx.beginPath();
      ctx.moveTo(
        cx + Math.cos(angle) * innerRadius,
        cy + Math.sin(angle) * innerRadius,
      );
      ctx.lineTo(
        cx + Math.cos(angle) * outerRadius,
        cy + Math.sin(angle) * outerRadius,
      );
      ctx.strokeStyle = `rgba(255,255,255,${Math.min(alpha, 0.92)})`;
      ctx.lineWidth = i % 6 === 0 ? 2.8 : 2.1;
      ctx.stroke();
    }

    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, cr, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const inner = i % 3 === 0 ? cr * 0.78 : cr * 0.88;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
    ctx.lineTo(cx + Math.cos(a) * cr, cy + Math.sin(a) * cr);
    ctx.strokeStyle =
      i % 3 === 0 ? "rgba(255,255,255,0.52)" : "rgba(255,255,255,0.20)";
    ctx.lineWidth = i % 3 === 0 ? 1.6 : 0.8;
    ctx.stroke();
  }

  const ha =
    ((now.getHours() % 12) / 12 + now.getMinutes() / 720) * Math.PI * 2 -
    Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(ha) * cr * 0.5, cy + Math.sin(ha) * cr * 0.5);
  ctx.strokeStyle = "rgba(255,255,255,0.90)";
  ctx.lineWidth = 2.0;
  ctx.lineCap = "round";
  ctx.stroke();

  const ma =
    (now.getMinutes() / 60 + now.getSeconds() / 3600) * Math.PI * 2 -
    Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(ma) * cr * 0.72, cy + Math.sin(ma) * cr * 0.72);
  ctx.strokeStyle = "rgba(255,255,255,0.90)";
  ctx.lineWidth = 1.3;
  ctx.stroke();

  const sa =
    (now.getSeconds() / 60 + now.getMilliseconds() / 60000) * Math.PI * 2 -
    Math.PI / 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(sa) * cr * 0.8, cy + Math.sin(sa) * cr * 0.8);
  ctx.strokeStyle = "rgba(125,192,26,0.88)";
  ctx.lineWidth = 0.9;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 2.6, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fill();

  ctx.font = `300 ${Math.round(fs * 0.55)}px 'Inter','Segoe UI',sans-serif`;
  ctx.fillStyle = beat.isPlaying
    ? `rgba(255,255,255,${0.55 + Math.min(beat.level * 0.35, 0.25)})`
    : "rgba(255,255,255,0.55)";
  ctx.textAlign = "center";
  ctx.fillText(`${hh}:${mm}`, cx, cy + cr + fs * 0.7);
  ctx.textAlign = "left";
  ctx.restore();
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function makeDrop(
  W: number,
  H: number,
  layer: 0 | 1 | 2,
  randomY = true,
): Drop {
  // layer 0 = far/background  layer 1 = mid  layer 2 = near/foreground
  const configs = [
    {
      lenMin: 8,
      lenMax: 15,
      spdMin: 5,
      spdMax: 9,
      wMin: 0.28,
      wMax: 0.45,
      opMin: 0.05,
      opMax: 0.11,
    },
    {
      lenMin: 15,
      lenMax: 28,
      spdMin: 10,
      spdMax: 15,
      wMin: 0.45,
      wMax: 0.68,
      opMin: 0.14,
      opMax: 0.24,
    },
    {
      lenMin: 28,
      lenMax: 52,
      spdMin: 17,
      spdMax: 28,
      wMin: 0.6,
      wMax: 1.05,
      opMin: 0.22,
      opMax: 0.42,
    },
  ] as const;
  const c = configs[layer];
  const spd = c.spdMin + Math.random() * (c.spdMax - c.spdMin);
  return {
    x: Math.random() * (W + 100) - 50,
    y: randomY ? Math.random() * H : -(8 + Math.random() * H * 0.3),
    len: c.lenMin + Math.random() * (c.lenMax - c.lenMin),
    spd,
    w: c.wMin + Math.random() * (c.wMax - c.wMin),
    op: c.opMin + Math.random() * (c.opMax - c.opMin),
    // slight organic angle variation per drop (±3°)
    wx: (Math.random() - 0.5) * 0.055,
  };
}

// ── Canvas overlay ─────────────────────────────────────────────────────────────
function CanvasOverlay() {
  const ref = useRef<HTMLCanvasElement>(null);
  const bg = useRef<Drop[]>([]); // far  — soft, misty
  const mid = useRef<Drop[]>([]); // mid  — standard
  const fg = useRef<Drop[]>([]); // near — crisp, fast
  const splashes = useRef<Splash[]>([]);
  const bokehs = useRef<Bokeh[]>([]);
  const clockRef = useRef<Date>(new Date());

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let raf: number;
    let prev = 0;

    // Base wind angle (radians) — subtle ~6° forward lean
    const BASE_ANGLE = 0.1;

    const init = (W: number, H: number) => {
      // Scale particle counts to viewport area so small / low-power screens
      // do less work (floored at 40% so it never looks bare).
      const scale = Math.min(1, (W * H) / (1600 * 900));
      const n = (base: number) =>
        Math.max(Math.round(base * scale), Math.round(base * 0.4));
      bg.current = Array.from({ length: n(120) }, () => makeDrop(W, H, 0));
      mid.current = Array.from({ length: n(100) }, () => makeDrop(W, H, 1));
      fg.current = Array.from({ length: n(65) }, () => makeDrop(W, H, 2));
      splashes.current = [];

      const WARM = [
        [255, 175, 80],
        [255, 200, 105],
        [255, 220, 140],
        [255, 155, 60],
        [255, 215, 125],
        [200, 225, 255],
        [220, 200, 255],
      ] as const;
      bokehs.current = Array.from({ length: n(22) }, () => {
        const big = Math.random() > 0.55;
        return {
          x: Math.random() * W,
          y: Math.random() * H * 0.6,
          r: big ? 22 + Math.random() * 44 : 6 + Math.random() * 16,
          rgb: WARM[Math.floor(Math.random() * WARM.length)],
          op: big ? 0.06 + Math.random() * 0.07 : 0.12 + Math.random() * 0.16,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      // Cap DPR — retina phones/laptops otherwise render a 2–3× canvas for
      // little visual gain and a large per-frame cost.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const W = window.innerWidth,
        H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
      init(W, H);
    };

    resize();
    window.addEventListener("resize", resize);
    const clockId = setInterval(() => {
      clockRef.current = new Date();
    }, 1000);

    // ── Draw a single rain streak ──────────────────────────────────────────
    function drawDrop(d: Drop) {
      const ang = BASE_ANGLE + d.wx;
      const dx = d.len * Math.sin(ang);
      const dy = d.len * Math.cos(ang);

      // Gradient: transparent top → bright lower-body → slight fade at tip
      // (leading edge = bottom = brightest, matching real streak photography)
      const g = ctx.createLinearGradient(d.x, d.y, d.x + dx, d.y + dy);
      g.addColorStop(0, `rgba(210,228,255,0)`);
      g.addColorStop(0.18, `rgba(210,228,255,${d.op * 0.35})`);
      g.addColorStop(0.6, `rgba(210,228,255,${d.op})`);
      g.addColorStop(0.88, `rgba(210,228,255,${d.op * 0.8})`);
      g.addColorStop(1, `rgba(210,228,255,${d.op * 0.2})`);

      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + dx, d.y + dy);
      ctx.strokeStyle = g;
      ctx.lineWidth = d.w;
      ctx.stroke();
    }

    // ── Advance a drop, return true if it needs reset ──────────────────────
    function advanceDrop(d: Drop, dt: number, H: number): boolean {
      const ang = BASE_ANGLE + d.wx;
      d.y += d.spd * dt;
      d.x += d.spd * dt * Math.sin(ang);
      return d.y > H + d.len;
    }

    const draw = (now: number) => {
      const dt = Math.min((now - prev) / 16.667, 3);
      prev = now;
      const t = now * 0.001;
      const W = window.innerWidth,
        H = window.innerHeight;

      ctx.clearRect(0, 0, W, H);

      // ── Atmospheric darkening ────────────────────────────────────────
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, W, H);

      // ── Bokeh shimmer ────────────────────────────────────────────────
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      bokehs.current.forEach((b) => {
        const p = 0.8 + 0.2 * Math.sin(t * 0.8 + b.phase);
        const [r, g, bl] = b.rgb;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, `rgba(${r},${g},${bl},${b.op * p})`);
        grad.addColorStop(0.45, `rgba(${r},${g},${bl},${b.op * p * 0.35})`);
        grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      ctx.restore();

      // ── Rain — layer 0 (far / misty) ─────────────────────────────────
      ctx.save();
      ctx.lineCap = "round";
      // Soft blur simulates atmospheric depth on far drops
      ctx.shadowColor = "rgba(200,220,255,0.25)";
      ctx.shadowBlur = 1.8;
      bg.current.forEach((d, i) => {
        drawDrop(d);
        if (advanceDrop(d, dt, H)) {
          bg.current[i] = makeDrop(W, H, 0, false);
        }
      });
      ctx.restore();

      // ── Rain — layer 1 (mid) ─────────────────────────────────────────
      ctx.save();
      ctx.lineCap = "round";
      mid.current.forEach((d, i) => {
        drawDrop(d);
        if (advanceDrop(d, dt, H)) {
          mid.current[i] = makeDrop(W, H, 1, false);
        }
      });
      ctx.restore();

      // ── Rain — layer 2 (near / foreground) ───────────────────────────
      ctx.save();
      ctx.lineCap = "round";
      fg.current.forEach((d, i) => {
        drawDrop(d);
        if (advanceDrop(d, dt, H)) {
          // Chance to spawn a splash at the ground zone
          if (
            d.y > H * 0.72 &&
            splashes.current.length < 60 &&
            Math.random() < 0.55
          ) {
            const life = 18 + Math.random() * 16;
            splashes.current.push({
              x: d.x + d.len * Math.sin(BASE_ANGLE),
              y: Math.min(d.y + d.len, H * 0.96),
              r: 0,
              maxR: 2.5 + Math.random() * 6.5,
              op: 0.3 + Math.random() * 0.25,
              age: 0,
              life,
            });
          }
          fg.current[i] = makeDrop(W, H, 2, false);
        }
      });
      ctx.restore();

      // ── Splashes (expanding ellipses on the "ground") ─────────────────
      ctx.save();
      ctx.lineCap = "round";
      splashes.current = splashes.current.filter((s) => {
        const progress = s.age / s.life;
        s.r = s.maxR * progress;
        s.op = (0.55 + 0.3 * Math.random()) * (1 - progress); // fade out
        s.age += dt;

        // Ellipse: wider than tall (rain hitting flat ground)
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.r * 2.0, s.r * 0.55, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(210,228,255,${s.op})`;
        ctx.lineWidth = 0.65;
        ctx.stroke();

        // Tiny centre dot at moment of impact
        if (progress < 0.25) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.2 * (1 - progress / 0.25), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220,235,255,${s.op * 1.4})`;
          ctx.fill();
        }

        return s.age < s.life;
      });
      ctx.restore();

      // ── Rain mist at ground level (subtle pooling haze) ────────────────
      const mistOp = 0.025 + 0.015 * Math.sin(t * 0.9);
      const mist = ctx.createLinearGradient(0, H * 0.74, 0, H);
      mist.addColorStop(0, `rgba(185,210,235,0)`);
      mist.addColorStop(0.4, `rgba(185,210,235,${mistOp})`);
      mist.addColorStop(1, `rgba(185,210,235,0)`);
      ctx.fillStyle = mist;
      ctx.fillRect(0, H * 0.74, W, H * 0.26);

      // ── Vignette ─────────────────────────────────────────────────────
      const vig = ctx.createRadialGradient(
        W * 0.5,
        H * 0.5,
        H * 0.22,
        W * 0.5,
        H * 0.5,
        H * 0.85,
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.52)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // ── Clock ─────────────────────────────────────────────────────────
      const fs = Math.max(12, Math.round(Math.min(W, H) * 0.018));
      drawClock(
        ctx,
        W * 0.032,
        H * 0.065,
        fs,
        clockRef.current,
        getGpmTunesVisualizerState(),
      );

    };

    // Honor reduced-motion: render one static frame, skip the animation loop.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Cap the animation to ~30fps — the scene reads the same as 60fps but
    // halves per-second draw work, which matters most on weak GPUs.
    const FRAME_MS = 1000 / 30;
    let lastDraw = 0;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - lastDraw < FRAME_MS) return;
      lastDraw = now;
      draw(now);
    };

    const start = () => {
      prev = performance.now();
      lastDraw = 0;
      raf = requestAnimationFrame(loop);
    };

    if (reduceMotion) {
      prev = performance.now();
      draw(prev);
    } else {
      start();
    }

    // Pause the loop entirely while the tab is hidden — no wasted frames.
    const onVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(clockId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}
    />
  );
}

// ── Export ─────────────────────────────────────────────────────────────────────
export function LiveWallpaper() {
  return (
    <>
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage: "url('/wallpapers/kawasaki-ninja-500.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 72%",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#050608",
        }}
      />
      <CanvasOverlay />
    </>
  );
}
