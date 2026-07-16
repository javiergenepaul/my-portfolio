"use client";

interface ResumeSkeletonProps {
  isDark?: boolean;
}

/**
 * Paper-shaped placeholder shown while a resume template chunk loads.
 * Mirrors the Modern layout — colored header, tinted sidebar with skill
 * rows, and a main column of dated entries — and flips its tones with
 * `isDark` so it blends with the preview.
 */
export function ResumeSkeleton({ isDark = false }: ResumeSkeletonProps) {
  const paper = isDark ? "#1E293B" : "#FFFFFF";
  const sidebar = isDark ? "#0F172A" : "#F1F5F9";
  const header = isDark ? "#0B1220" : "#334155";
  const bar = isDark ? "#334155" : "#E2E8F0";
  const barSoft = isDark ? "#293548" : "#EDF1F6";
  const onHeader = isDark ? "#1E2A3D" : "#475569";

  const Bar = ({
    w,
    h = 8,
    soft = false,
    color,
    round = 4,
  }: {
    w: number | string;
    h?: number;
    soft?: boolean;
    color?: string;
    round?: number;
  }) => (
    <div
      className="animate-pulse"
      style={{
        width: typeof w === "number" ? `${w}%` : w,
        height: h,
        borderRadius: round,
        backgroundColor: color ?? (soft ? barSoft : bar),
      }}
    />
  );

  const Dots = () => (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            backgroundColor: bar,
          }}
        />
      ))}
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        width: 794,
        height: 1123,
        backgroundColor: paper,
        overflow: "hidden",
      }}
    >
      {/* Full-height sidebar tint — sits behind content so it always reaches
          the bottom of the page regardless of how much content renders. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 224,
          backgroundColor: sidebar,
        }}
      />

      {/* ── Colored header: name, title, contact row (spans full width) ── */}
      <div
        style={{
          position: "relative",
          backgroundColor: header,
          padding: "30px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Bar w="42%" h={22} color={onHeader} round={6} />
        <Bar w="26%" h={11} color={onHeader} round={5} />
        <div style={{ display: "flex", gap: 18, marginTop: 6 }}>
          {[90, 80, 70, 110].map((w, i) => (
            <Bar key={i} w={`${w}px`} h={8} color={onHeader} round={5} />
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ position: "relative", display: "flex" }}>
        {/* Sidebar content (tint comes from the panel above) */}
        <div
          style={{
            width: 224,
            padding: "26px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Bar w="45%" h={9} />
            <Bar w="100%" soft />
            <Bar w="92%" soft />
            <Bar w="78%" soft />
          </div>

          {/* Skill groups: label + rows of (name • dots) */}
          {Array.from({ length: 2 }).map((_, g) => (
            <div
              key={g}
              style={{ display: "flex", flexDirection: "column", gap: 9 }}
            >
              <Bar w="55%" h={9} />
              {Array.from({ length: 4 }).map((_, r) => (
                <div
                  key={r}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Bar w="52%" soft />
                  <Dots />
                </div>
              ))}
            </div>
          ))}

          {/* Education */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Bar w="48%" h={9} />
            <Bar w="85%" soft />
            <Bar w="70%" soft />
          </div>
        </div>

        {/* Main column */}
        <div
          style={{
            flex: 1,
            padding: "26px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              {/* entry title + date */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Bar w="46%" h={12} />
                <Bar w="72px" h={9} round={9} />
              </div>
              <Bar w="34%" h={9} soft />
              {/* bullet lines */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  marginTop: 2,
                }}
              >
                <Bar w="100%" soft />
                <Bar w="97%" soft />
                <Bar w="90%" soft />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
