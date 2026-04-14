import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Gene Paul Mar Javier — 2025 Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const profileImg = await readFile(join(process.cwd(), "public/ghibli-avatar.png"));
  const profileSrc = `data:image/png;base64,${profileImg.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "#0C0509",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Rose glow blobs */}
        <div style={{ position: "absolute", top: -80, left: -40, width: 440, height: 440, borderRadius: "50%", background: "rgba(225,29,72,0.12)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -100, left: 200, width: 360, height: 360, borderRadius: "50%", background: "rgba(251,113,133,0.07)", display: "flex" }} />
        <div style={{ position: "absolute", top: -60, right: 100, width: 300, height: 300, borderRadius: "50%", background: "rgba(225,29,72,0.07)", display: "flex" }} />

        {/* Year watermark */}
        <div style={{ position: "absolute", right: -20, bottom: -40, display: "flex" }}>
          <span style={{ fontSize: 240, fontWeight: 900, color: "rgba(225,29,72,0.05)", letterSpacing: "-0.05em", lineHeight: 1 }}>
            2025
          </span>
        </div>

        {/* Left content */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 0 60px 72px", flex: 1 }}>

          {/* Year badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ display: "flex", background: "rgba(225,29,72,0.12)", border: "1px solid rgba(225,29,72,0.30)", borderRadius: 8, padding: "6px 16px" }}>
              <span style={{ color: "#FB7185", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em" }}>
                2025 EDITION
              </span>
            </div>
            <div style={{ display: "flex", background: "rgba(225,29,72,0.08)", borderRadius: 6, padding: "6px 12px" }}>
              <span style={{ color: "#FDA4AF", fontSize: 12, letterSpacing: "0.06em" }}>Moonlight Red</span>
            </div>
          </div>

          {/* Name */}
          <div style={{ display: "flex", flexDirection: "column", marginBottom: 14 }}>
            <span style={{ color: "#FFFFFF", fontSize: 50, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Gene Paul Mar Javier
            </span>
          </div>

          {/* Title */}
          <div style={{ display: "flex", marginBottom: 28 }}>
            <span style={{ color: "#FDA4AF", fontSize: 20, fontWeight: 500 }}>
              Full-Stack Software Engineer
            </span>
          </div>

          {/* Description */}
          <div style={{ display: "flex", marginBottom: 32 }}>
            <span style={{ color: "#6B7280", fontSize: 16, lineHeight: 1.5 }}>
              React · Next.js · Spring Boot · TypeScript · Java · Vue.js · Zustand
            </span>
          </div>

          {/* Location + domain */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E11D48", display: "flex" }} />
              <span style={{ color: "#FB7185", fontSize: 14 }}>Cebu, Philippines</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(225,29,72,0.4)", display: "flex" }} />
              <span style={{ color: "#374151", fontSize: 14 }}>gene-paul-mar-javier.dev/2025</span>
            </div>
          </div>
        </div>

        {/* Right — profile photo with rose ring */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 72px 60px 0", width: 340 }}>
          <div style={{ display: "flex", position: "relative" }}>
            <div style={{ display: "flex", width: 250, height: 250, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(225,29,72,0.30)", boxShadow: "0 0 0 1px rgba(225,29,72,0.15), 0 0 60px rgba(225,29,72,0.18), 0 24px 60px rgba(0,0,0,0.6)" }}>
              <img src={profileSrc} width={250} height={250} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
            {/* Rose accent dot */}
            <div style={{ position: "absolute", bottom: 10, right: 10, width: 18, height: 18, borderRadius: "50%", background: "#E11D48", border: "3px solid #0C0509", display: "flex" }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
