"use client";

import { useEffect, useMemo, useState } from "react";
import {
  materials,
  sites,
  type DisposalSite,
  type MaterialId,
  type SiteRate,
} from "@/lib/tip-finder-data";

const POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
const DEFAULT_PENCE_PER_MILE = 50;

interface PostcodeResult {
  lat: number;
  lng: number;
  formatted: string;
}

function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function drivingMiles(crowMiles: number): number {
  return crowMiles * 1.35;
}

function isOpenNow(site: DisposalSite): boolean {
  const now = new Date();
  const today = site.hours.find((h) => h.day === now.getDay());
  if (!today) return false;
  const mins = now.getHours() * 60 + now.getMinutes();
  const [oH, oM] = today.open.split(":").map(Number);
  const [cH, cM] = today.close.split(":").map(Number);
  return mins >= oH * 60 + oM && mins < cH * 60 + cM;
}

function todaysHours(site: DisposalSite): string {
  const today = site.hours.find((h) => h.day === new Date().getDay());
  return today ? `${today.open} – ${today.close}` : "Closed today";
}

interface RankedSite {
  site: DisposalSite;
  rate: SiteRate;
  driveMiles: number;
  travelCost: number;
  disposalCost: number;
  totalCost: number;
  open: boolean;
}

function rankSites(
  material: MaterialId,
  weightTonnes: number,
  origin: PostcodeResult | null,
  pencePerMile: number,
): RankedSite[] {
  return sites
    .filter((s) => s.rates[material] !== undefined)
    .map((site) => {
      const rate = site.rates[material]!;
      const crow = origin ? haversineMiles(origin.lat, origin.lng, site.lat, site.lng) : 0;
      const drive = drivingMiles(crow);
      const travelCost = origin ? (drive * 2 * pencePerMile) / 100 : 0;
      const raw = weightTonnes * rate.pricePerTonne;
      const disposalCost = rate.minCharge && raw < rate.minCharge ? rate.minCharge : raw;
      return {
        site,
        rate,
        driveMiles: drive,
        travelCost,
        disposalCost,
        totalCost: disposalCost + travelCost,
        open: isOpenNow(site),
      };
    })
    .sort((a, b) => a.totalCost - b.totalCost);
}

export default function TipFinder() {
  const [postcodeInput, setPostcodeInput] = useState("");
  const [origin, setOrigin] = useState<PostcodeResult | null>(null);
  const [lookupState, setLookupState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [material, setMaterial] = useState<MaterialId>("mixed");
  const [weight, setWeight] = useState<number>(1);
  const [pencePerMile, setPencePerMile] = useState<number>(DEFAULT_PENCE_PER_MILE);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    const trimmed = postcodeInput.trim().toUpperCase();
    if (!trimmed) {
      setOrigin(null);
      setLookupState("idle");
      return;
    }
    if (!POSTCODE_REGEX.test(trimmed)) {
      setOrigin(null);
      setLookupState("idle");
      return;
    }
    const ctrl = new AbortController();
    setLookupState("loading");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(trimmed)}`,
          { signal: ctrl.signal },
        );
        const data = await res.json();
        if (data.status === 200 && data.result) {
          setOrigin({
            lat: data.result.latitude,
            lng: data.result.longitude,
            formatted: data.result.postcode,
          });
          setLookupState("ok");
        } else {
          setOrigin(null);
          setLookupState("error");
        }
      } catch (err: unknown) {
        if ((err as Error).name !== "AbortError") {
          setOrigin(null);
          setLookupState("error");
        }
      }
    }, 400);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [postcodeInput]);

  const ranked = useMemo(
    () => rankSites(material, weight, origin, pencePerMile),
    [material, weight, origin, pencePerMile],
  );

  const overview = useMemo(() => {
    return materials.map((m) => {
      const matches = sites
        .filter((s) => s.rates[m.id] !== undefined)
        .map((s) => ({ site: s, rate: s.rates[m.id]! }))
        .sort((a, b) => a.rate.pricePerTonne - b.rate.pricePerTonne);
      return { material: m, matches };
    });
  }, []);

  const cardStyle = {
    background: "linear-gradient(145deg, rgba(26,68,29,0.5), rgba(10,31,11,0.7))",
    border: "1px solid rgba(212,160,23,0.15)",
  } as const;

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(212,160,23,0.18)",
    borderRadius: "12px",
    padding: "12px 14px",
    color: "var(--cream)",
    fontSize: "14px",
    width: "100%",
    outline: "none",
  } as const;

  return (
    <section className="px-5 md:px-8 py-12 md:py-20 max-w-7xl mx-auto">
      <div className="mb-8 md:mb-12">
        <p className="section-label mb-3">Operations Tool</p>
        <h1
          className="leading-none mb-4"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.6rem, 8vw, 5rem)",
            color: "var(--cream)",
            letterSpacing: "0.02em",
          }}
        >
          TIP <span className="gold-text">FINDER</span>
        </h1>
        <p className="max-w-2xl text-base md:text-lg" style={{ color: "rgba(245,240,232,0.65)" }}>
          Enter the job postcode, pick a material, and we&apos;ll rank our
          disposal sites by true total cost — disposal fee plus the van
          run there and back.
        </p>
      </div>

      <div className="rounded-2xl p-5 md:p-8 mb-8" style={cardStyle}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <label className="block md:col-span-2">
            <span className="block text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(212,160,23,0.7)" }}>
              Job Postcode
            </span>
            <div className="relative">
              <input
                value={postcodeInput}
                onChange={(e) => setPostcodeInput(e.target.value.toUpperCase())}
                placeholder="e.g. G1 1XQ"
                style={inputStyle}
                autoComplete="postal-code"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold tracking-widest">
                {lookupState === "loading" && (<span style={{ color: "rgba(245,240,232,0.45)" }}>…</span>)}
                {lookupState === "ok" && origin && (<span style={{ color: "var(--gold)" }}>✓ {origin.formatted}</span>)}
                {lookupState === "error" && (<span className="text-red-400">NOT FOUND</span>)}
              </span>
            </div>
          </label>

          <label className="block">
            <span className="block text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(212,160,23,0.7)" }}>
              Est. Weight (tonnes)
            </span>
            <input
              type="number"
              min={0}
              step={0.25}
              value={weight}
              onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
              style={inputStyle}
            />
          </label>
        </div>

        <div className="mb-4">
          <span className="block text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(212,160,23,0.7)" }}>
            Material
          </span>
          <div className="flex flex-wrap gap-2">
            {materials.map((m) => {
              const active = m.id === material;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMaterial(m.id)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: active ? "linear-gradient(135deg, #d4a017, #f0c040)" : "rgba(255,255,255,0.04)",
                    color: active ? "#0a1f0b" : "rgba(245,240,232,0.75)",
                    border: active ? "1px solid transparent" : "1px solid rgba(212,160,23,0.18)",
                  }}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAdvancedOpen((v) => !v)}
          className="text-xs font-semibold tracking-widest uppercase mt-2"
          style={{ color: "var(--gold)", opacity: 0.7 }}
        >
          {advancedOpen ? "− Hide" : "+ Advanced"} cost settings
        </button>
        {advancedOpen && (
          <div className="mt-4 max-w-xs">
            <label className="block">
              <span className="block text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(212,160,23,0.7)" }}>
                Van cost per mile (pence)
              </span>
              <input
                type="number"
                min={0}
                step={5}
                value={pencePerMile}
                onChange={(e) => setPencePerMile(Math.max(0, parseInt(e.target.value) || 0))}
                style={inputStyle}
              />
              <span className="block mt-2 text-xs" style={{ color: "rgba(245,240,232,0.45)" }}>
                Round-trip fuel + wear. Adjust if diesel changes.
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="mb-12">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-2xl md:text-3xl" style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.04em" }}>
            RANKED <span className="gold-text">RESULTS</span>
          </h2>
          {origin && (
            <span className="text-xs tracking-widest" style={{ color: "rgba(245,240,232,0.5)" }}>
              FROM {origin.formatted}
            </span>
          )}
        </div>

        {ranked.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={cardStyle}>
            <p style={{ color: "rgba(245,240,232,0.6)" }}>
              No sites in our network currently accept that material. Try another, or add a new supplier in <code>lib/tip-finder-data.ts</code>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {ranked.map((r, i) => {
              const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.site.address + " " + r.site.postcode)}`;
              const telHref = r.site.phone ? `tel:${r.site.phone.replace(/\s/g, "")}` : "";
              return (
                <div
                  key={r.site.id}
                  className="rounded-2xl p-5 md:p-6"
                  style={{
                    ...cardStyle,
                    borderColor: i === 0 ? "rgba(212,160,23,0.45)" : "rgba(212,160,23,0.15)",
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                        style={{
                          background: i === 0 ? "linear-gradient(135deg, #d4a017, #f0c040)" : "rgba(212,160,23,0.1)",
                          color: i === 0 ? "#0a1f0b" : "var(--gold)",
                          border: "1px solid rgba(212,160,23,0.3)",
                        }}
                      >
                        #{i + 1}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-xl" style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.04em", color: "var(--cream)" }}>
                            {r.site.name}
                          </h3>
                          <span
                            className="text-[10px] font-bold tracking-widest px-2 py-1 rounded-full"
                            style={{
                              background: r.open ? "rgba(51,134,56,0.18)" : "rgba(220,80,80,0.15)",
                              color: r.open ? "#8ac48d" : "#e6a0a0",
                            }}
                          >
                            {r.open ? "OPEN NOW" : "CLOSED"}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: "rgba(245,240,232,0.55)" }}>
                          {r.site.address} · {r.site.postcode} · {todaysHours(r.site)}
                        </p>
                        {r.site.notes && (
                          <p className="text-xs mt-1 italic" style={{ color: "rgba(245,240,232,0.4)" }}>
                            {r.site.notes}
                          </p>
                        )}
                        {r.rate.notes && (
                          <p className="text-xs mt-1" style={{ color: "var(--gold)", opacity: 0.7 }}>
                            ⚑ {r.rate.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6 md:text-right">
                      <Metric label="Rate" value={`£${r.rate.pricePerTonne}/t`} />
                      <Metric label="Distance" value={origin ? `${r.driveMiles.toFixed(1)} mi` : "—"} />
                      <Metric label="Total" value={`£${r.totalCost.toFixed(2)}`} highlight={i === 0} />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3" style={{ borderTop: "1px solid rgba(212,160,23,0.1)" }}>
                    <p className="text-xs" style={{ color: "rgba(245,240,232,0.55)" }}>
                      Disposal £{r.disposalCost.toFixed(2)}
                      {origin && ` + travel £${r.travelCost.toFixed(2)}`}
                      {r.rate.minCharge && r.disposalCost === r.rate.minCharge && (
                        <span style={{ color: "var(--gold)", opacity: 0.8 }}> (min charge applied)</span>
                      )}
                    </p>
                    <div className="flex gap-2">
                      <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full text-xs font-semibold" style={{ background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.3)", color: "var(--gold-light)" }}>Directions →</a>
                      {r.site.phone && (
                        <a href={telHref} className="px-4 py-2 rounded-full text-xs font-semibold" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(245,240,232,0.18)", color: "var(--cream)" }}>Call</a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <div className="mb-5">
          <p className="section-label mb-2">Reference</p>
          <h2 className="text-2xl md:text-3xl" style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.04em" }}>
            CHEAPEST <span className="gold-text">PER MATERIAL</span>
          </h2>
          <p className="text-sm mt-2" style={{ color: "rgba(245,240,232,0.5)" }}>
            Ignoring distance — quick reference for planning. Gold = cheapest in network.
          </p>
        </div>

        <div className="rounded-2xl overflow-x-auto" style={cardStyle}>
          <table className="w-full text-sm" style={{ minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(212,160,23,0.15)" }}>
                <th className="text-left p-4 text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(212,160,23,0.7)" }}>Material</th>
                {sites.map((s) => (
                  <th key={s.id} className="text-left p-4 text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(212,160,23,0.7)" }}>{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {overview.map(({ material: m, matches }) => {
                const cheapestId = matches[0]?.site.id;
                return (
                  <tr key={m.id} style={{ borderBottom: "1px solid rgba(212,160,23,0.06)" }}>
                    <td className="p-4 font-semibold" style={{ color: "var(--cream)" }}>{m.name}</td>
                    {sites.map((s) => {
                      const rate = s.rates[m.id];
                      const isCheapest = s.id === cheapestId && rate !== undefined;
                      return (
                        <td
                          key={s.id}
                          className="p-4"
                          style={{
                            color: rate ? (isCheapest ? "var(--gold-light)" : "rgba(245,240,232,0.7)") : "rgba(245,240,232,0.25)",
                            fontWeight: isCheapest ? 700 : 400,
                          }}
                        >
                          {rate ? `£${rate.pricePerTonne}/t` : "—"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(212,160,23,0.7)" }}>{label}</div>
      <div className="text-lg md:text-xl font-semibold" style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.04em", color: highlight ? "var(--gold-light)" : "var(--cream)" }}>{value}</div>
    </div>
  );
}