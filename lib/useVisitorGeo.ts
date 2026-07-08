"use client";

import { useEffect, useState } from "react";

export interface VisitorGeo {
  city: string | null;
  region: string | null;
  country: string | null;
}

// Module-level cache so every component sharing a page load reuses one
// fetch instead of hitting /api/geo per mount.
let cached: VisitorGeo | undefined;
let pending: Promise<VisitorGeo> | null = null;

async function fetchGeo(): Promise<VisitorGeo> {
  if (cached) return cached;
  if (!pending) {
    pending = fetch("/api/geo")
      .then((res) => res.json())
      .catch(() => ({ city: null, region: null, country: null }))
      .then((geo: VisitorGeo) => {
        cached = geo;
        return geo;
      });
  }
  return pending;
}

/** Returns `undefined` until the visitor's geo has resolved at least once. */
export function useVisitorGeo(): VisitorGeo | undefined {
  const [geo, setGeo] = useState<VisitorGeo | undefined>(cached);

  useEffect(() => {
    if (geo) return;
    let active = true;
    fetchGeo().then((g) => {
      if (active) setGeo(g);
    });
    return () => {
      active = false;
    };
  }, [geo]);

  return geo;
}
