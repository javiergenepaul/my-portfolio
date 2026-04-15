import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Gene Paul Mar Javier — 2026 Interactive macOS Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const profileImg = await readFile(
    join(process.cwd(), "public/ghibli-avatar.png"),
  );
  const profileSrc = `data:image/png;base64,${profileImg.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        background: "#0B0F14",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Aurora glow blobs */}
      <div
        style={{
          position: "absolute",
          top: -80,
          left: -60,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(45,212,191,0.10)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 300,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(167,139,250,0.09)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          right: 250,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "rgba(74,222,128,0.07)",
          display: "flex",
        }}
      />

      {/* Year watermark */}
      <div
        style={{
          position: "absolute",
          right: -20,
          bottom: -40,
          display: "flex",
        }}
      >
        <span
          style={{
            fontSize: 240,
            fontWeight: 900,
            color: "rgba(45,212,191,0.04)",
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          2026
        </span>
      </div>

      {/* macOS dock accent bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background:
            "linear-gradient(90deg, rgba(45,212,191,0.6) 0%, rgba(167,139,250,0.6) 50%, rgba(74,222,128,0.6) 100%)",
          display: "flex",
        }}
      />

      {/* Left content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 0 60px 72px",
          flex: 1,
        }}
      >
        {/* Year badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              background: "rgba(45,212,191,0.10)",
              border: "1px solid rgba(45,212,191,0.28)",
              borderRadius: 8,
              padding: "6px 16px",
            }}
          >
            <span
              style={{
                color: "#2DD4BF",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              2026 EDITION
            </span>
          </div>
          <div
            style={{
              display: "flex",
              background: "rgba(167,139,250,0.08)",
              border: "1px solid rgba(167,139,250,0.20)",
              borderRadius: 6,
              padding: "6px 12px",
            }}
          >
            <span
              style={{
                color: "#C4B5FD",
                fontSize: 12,
                letterSpacing: "0.06em",
              }}
            >
              Aurora · macOS
            </span>
          </div>
        </div>

        {/* Name */}
        <div
          style={{ display: "flex", flexDirection: "column", marginBottom: 14 }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 50,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Gene Paul Mar Javier
          </span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", marginBottom: 12 }}>
          <span style={{ color: "#94A3B8", fontSize: 20, fontWeight: 400 }}>
            Full-Stack Software Engineer
          </span>
        </div>

        {/* Subtitle */}
        <div style={{ display: "flex", marginBottom: 28 }}>
          <span
            style={{
              color: "#2DD4BF",
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            Interactive macOS-inspired portfolio experience
          </span>
        </div>

        {/* Tech */}
        <div style={{ display: "flex", marginBottom: 32 }}>
          <span style={{ color: "#4B5563", fontSize: 15, lineHeight: 1.5 }}>
            React · Next.js · Spring Boot · TypeScript · Java · Vue.js
          </span>
        </div>

        {/* Dock-style accent dots + domain */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#2DD4BF",
                display: "flex",
              }}
            />
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#A78BFA",
                display: "flex",
              }}
            />
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#4ADE80",
                display: "flex",
              }}
            />
          </div>
          <span style={{ color: "#374151", fontSize: 14 }}>
            gene-paul-mar-javier.dev/2026
          </span>
        </div>
      </div>

      {/* Right — profile photo with aurora ring */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 72px 60px 0",
          width: 340,
        }}
      >
        <div style={{ display: "flex", position: "relative" }}>
          {/* Outer aurora ring */}
          <div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: "50%",
              border: "2px solid rgba(45,212,191,0.25)",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: "50%",
              border: "1px solid rgba(167,139,250,0.12)",
              display: "flex",
            }}
          />
          <div
            style={{
              display: "flex",
              width: 250,
              height: 250,
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid rgba(45,212,191,0.20)",
              boxShadow:
                "0 0 40px rgba(45,212,191,0.12), 0 0 80px rgba(167,139,250,0.10), 0 24px 60px rgba(0,0,0,0.6)",
            }}
          >
            <img
              src={profileSrc}
              width={250}
              height={250}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
          {/* Teal accent dot */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#2DD4BF",
              border: "3px solid #0B0F14",
              display: "flex",
            }}
          />
        </div>
      </div>
    </div>,
    { ...size },
  );
}
