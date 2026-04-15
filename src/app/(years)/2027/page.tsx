"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const DeskScene = dynamic(
  () =>
    import("@/components/2027/desk-scene").then((m) => ({
      default: m.DeskScene,
    })),
  { ssr: false },
);

export default function Page2027() {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        background: "#07070a",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Full-screen 3D canvas */}
      <div style={{ position: "absolute", inset: 0 }}>
        <DeskScene />
      </div>

      {/* Gradient vignette overlay so UI text is readable */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 45% at 50% 100%, rgba(5,4,12,0.88) 0%, transparent 68%), " +
            "linear-gradient(to bottom, rgba(7,7,10,0.52) 0%, transparent 22%, transparent 58%, rgba(5,4,12,0.72) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Scanline overlay across whole page */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Top-left badge */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          position: "absolute",
          top: 20,
          left: 24,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 14px",
          borderRadius: 999,
          border: "1px solid rgba(167,139,250,0.3)",
          background: "rgba(10,8,20,0.7)",
          backdropFilter: "blur(10px)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(167,139,250,0.9)",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#a78bfa",
            boxShadow: "0 0 8px #a78bfa",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
        GPM Portfolio · 2027
      </motion.div>

      {/* Centre overlay text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: "7vh",
          pointerEvents: "none",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.55 }}
          style={{
            margin: "0 0 10px",
            fontSize: 11,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Gene Paul Mar Javier
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.65 }}
          style={{
            margin: "0 0 14px",
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            textAlign: "center",
            background:
              "linear-gradient(120deg, #ffffff 20%, #a78bfa 60%, #00ffcc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Coming Soon
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.82 }}
          style={{
            margin: "0 0 28px",
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.04em",
            textAlign: "center",
          }}
        >
          The next portfolio experience is being built.
        </motion.p>

        {/* Back button — re-enable pointer events */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          style={{ pointerEvents: "auto" }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 22px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              color: "rgba(255,255,255,0.55)",
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "rgba(255,255,255,0.55)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
            }}
          >
            <ArrowLeft size={14} />
            Back to all years
          </Link>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
