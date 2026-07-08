"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";
import { useVisitorGeo } from "@/lib/useVisitorGeo";

interface AreaViewTrackerProps {
  area: string;
  council: string;
  /** Combo pages pass the service name (e.g. "House Clearance"); area hub pages omit it. */
  service?: string;
}

// Mounted on area pages so visits are reported as a filterable "Area Page View"
// event (grouped by area name) instead of dozens of separate page routes.
export default function AreaViewTracker({ area, council, service }: AreaViewTrackerProps) {
  const geo = useVisitorGeo();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !geo) return;
    fired.current = true;
    track("Area Page View", {
      area,
      council,
      service: service ?? "hub",
      city: geo.city ?? "unknown",
      region: geo.region ?? "unknown",
    });
  }, [geo, area, council, service]);

  return null;
}
