import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Gene Paul Mar Javier — Full-Stack Software Engineer";
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
        background: "#05070F",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Background gradient blobs */}
      <div
        style={{
          position: "absolute",
          top: -80,
          left: -80,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(99,102,241,0.12)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          right: 300,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "rgba(45,212,191,0.08)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 80,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(167,139,250,0.09)",
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
        {/* Badge */}
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 28 }}
        >
          <div
            style={{
              display: "flex",
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.35)",
              borderRadius: 8,
              padding: "6px 14px",
            }}
          >
            <span
              style={{
                color: "#A5B4FC",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.08em",
              }}
            >
              PORTFOLIO
            </span>
          </div>
        </div>

        {/* Name */}
        <div
          style={{ display: "flex", flexDirection: "column", marginBottom: 16 }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Gene Paul Mar
          </span>
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Javier
          </span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", marginBottom: 32 }}>
          <span
            style={{
              color: "#94A3B8",
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: "0.01em",
            }}
          >
            Full-Stack Software Engineer
          </span>
        </div>

        {/* Tech tags */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 36,
          }}
        >
          {[
            "React",
            "Next.js",
            "Spring Boot",
            "TypeScript",
            "Java",
            "Vue.js",
          ].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 6,
                padding: "5px 12px",
              }}
            >
              <span style={{ color: "#CBD5E1", fontSize: 13, fontWeight: 500 }}>
                {tag}
              </span>
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#22C55E",
              display: "flex",
            }}
          />
          <span
            style={{ color: "#64748B", fontSize: 15, letterSpacing: "0.02em" }}
          >
            gene-paul-mar-javier.dev
          </span>
        </div>
      </div>

      {/* Right — profile photo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 72px 60px 0",
          width: 340,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 260,
            height: 260,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.1)",
            boxShadow:
              "0 0 0 1px rgba(99,102,241,0.3), 0 24px 60px rgba(0,0,0,0.5)",
          }}
        >
          <img
            src={profileSrc}
            width={260}
            height={260}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>,
    { ...size },
  );
}
