import { ImageResponse } from "next/og";
import { getAllAreas } from "@/lib/get-all-areas";
import { parseSlugWithAreas } from "@/lib/areas";

export const runtime = "edge";
export const alt = "Envirocycle Glasgow";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const allAreas = await getAllAreas();
  const combo = parseSlugWithAreas(params.slug, allAreas);
  const title = combo
    ? `${combo.service.searchPhrase} in ${combo.area.name}`
    : "Envirocycle Glasgow";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0a1f0b 0%, #1a441d 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            color: "#d4a017",
            letterSpacing: 4,
          }}
        >
          ENVIROCYCLE GLASGOW
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            color: "#f5f0e8",
            lineHeight: 1.15,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            width: 100,
            height: 6,
            background: "#d4a017",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
