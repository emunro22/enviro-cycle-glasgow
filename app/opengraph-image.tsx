import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Envirocycle Glasgow — Waste Management, Uplifts & Recycling";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a1f0b 0%, #1a441d 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 140,
            height: 6,
            background: "#d4a017",
            marginBottom: 40,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: -2,
            color: "#f5f0e8",
          }}
        >
          ENVIROCYCLE
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 600,
            color: "#d4a017",
            marginTop: 8,
            letterSpacing: 4,
          }}
        >
          GLASGOW
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "rgba(245,240,232,0.75)",
            marginTop: 28,
          }}
        >
          Waste Management · Uplifts · Recycling
        </div>
      </div>
    ),
    { ...size }
  );
}
