interface AreaMapProps {
  /** Free-text location to center the map on, e.g. "Blantyre, G72, Glasgow, UK" */
  query: string;
  /** Accessible title for the iframe, e.g. "Map of our coverage in Blantyre" */
  title: string;
  /** Google Maps zoom level (lower = more zoomed out). Defaults to 12. */
  zoom?: number;
}

/**
 * No-API-key Google Maps embed. Uses the classic "output=embed" URL rather
 * than the official Maps Embed API, so it doesn't need a billing-enabled key.
 */
export default function AreaMap({ query, title, zoom = 12 }: AreaMapProps) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(212,160,23,0.15)" }}
    >
      <iframe
        title={title}
        src={src}
        width="100%"
        height="280"
        style={{ border: 0, display: "block" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
