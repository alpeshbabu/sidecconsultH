import { ImageResponse } from "next/og";

// Code-generated favicon — an "S" monogram in the site's ink/signal palette.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#10141d",
          color: "#22d3ee",
          fontSize: 44,
          fontWeight: 800,
          fontFamily: "sans-serif",
          borderRadius: 12,
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
