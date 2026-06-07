import { ImageResponse } from "next/og";

// Code-generated social share image (Open Graph + Twitter). Next applies this
// to og:image and twitter:image site-wide unless a route sets its own.
export const runtime = "edge";
export const alt = "SIDEC Consulting — AI for Injection Molding Manufacturing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Palette mirrors the site: ink navy background + signal cyan accent.
const INK = "#1b2230";
const INK_2 = "#10141d";
const SIGNAL = "#22d3ee";
const FG = "#f4f6fb";
const MUTED = "#9aa6bb";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${INK} 0%, ${INK_2} 100%)`,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: SIGNAL }} />

        {/* eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: SIGNAL,
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <span>SIDEC Consulting</span>
          <span style={{ color: MUTED }}>·</span>
          <span style={{ color: MUTED }}>Molding × Applied AI</span>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: FG,
              fontSize: 78,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            Bring AI to Injection Molding
          </div>
          <div
            style={{
              color: SIGNAL,
              fontSize: 78,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: -1.5,
            }}
          >
            Without Breaking Validation
          </div>
        </div>

        {/* footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: MUTED,
            fontSize: 28,
          }}
        >
          <span style={{ maxWidth: 760 }}>
            Validated, explainable, audit-ready AI — from 25+ years on the molding floor.
          </span>
          <div style={{ display: "flex", gap: 12 }}>
            {["ISO 13485", "QMSR", "DOE+ML"].map((t) => (
              <span
                key={t}
                style={{
                  border: `1px solid rgba(154,166,187,0.4)`,
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontSize: 22,
                  color: FG,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
