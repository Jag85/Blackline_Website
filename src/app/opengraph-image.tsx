import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — Clarity. Strategy. Momentum.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default OG image used for the home page and as the fallback for any
// route that doesn't ship its own opengraph-image. Generated at build time.
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Brand chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#6b7280",
            marginBottom: 40,
          }}
        >
          {SITE_NAME}
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 120,
            fontWeight: 800,
            color: "#1a1a1a",
            lineHeight: 1.05,
            letterSpacing: -3,
            marginBottom: 30,
          }}
        >
          <div>Clarity.</div>
          <div>Strategy.</div>
          <div style={{ color: "#9ca3af" }}>Momentum.</div>
        </div>

        {/* Subhead */}
        <div
          style={{
            fontSize: 28,
            color: "#4b5563",
            marginTop: "auto",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Strategic consulting for founders ready to grow.
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#1a1a1a",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
