"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type CustomArea = {
  slug: string;
  name: string;
  postcodes: string;
  council: string;
  travel_minutes: number;
  local_hook: string;
  landmarks: string;
  services: string;
  created_at: string;
};

const COUNCILS = [
  "South Lanarkshire",
  "North Lanarkshire",
  "Glasgow City",
  "East Renfrewshire",
  "Renfrewshire",
  "East Dunbartonshire",
  "West Dunbartonshire",
];

function ServiceTierBadge({ minutes }: { minutes: number }) {
  if (minutes <= 15) return <span className="text-xs text-green-400">All 8 services</span>;
  if (minutes <= 22) return <span className="text-xs text-yellow-400">3 services (extended)</span>;
  return <span className="text-xs text-orange-400">1 service (outer)</span>;
}

export default function AdminAreasPage() {
  const router = useRouter();
  const [areas, setAreas] = useState<CustomArea[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [postcodes, setPostcodes] = useState("");
  const [council, setCouncil] = useState("");
  const [travelMinutes, setTravelMinutes] = useState(20);
  const [localHook, setLocalHook] = useState("");
  const [landmarks, setLandmarks] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function loadAreas() {
    setLoading(true);
    const res = await fetch(`/api/areas?t=${Date.now()}`, { cache: "no-store" });
    const data = await res.json();
    setAreas(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadAreas();
  }, []);

  // Live slug preview
  const slugPreview = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Tier hint
  function tierLabel(min: number) {
    if (min <= 15) return "All 8 services";
    if (min <= 22) return "Rubbish removal, waste removal & house clearance";
    return "Rubbish removal only";
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!name || !council) {
      setError("Area name and council are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          postcodes: postcodes.split(",").map((s) => s.trim()).filter(Boolean),
          council,
          travel_minutes: travelMinutes,
          local_hook: localHook,
          landmarks: landmarks.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }

      setName("");
      setPostcodes("");
      setCouncil("");
      setTravelMinutes(20);
      setLocalHook("");
      setLandmarks("");
      setSuccessMsg(`Area "${name}" added — it will appear on the site within a few minutes.`);
      await loadAreas();
      router.refresh();
      setTimeout(() => setSuccessMsg(""), 6000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(slug: string, areaName: string) {
    if (!confirm(`Delete "${areaName}"? This removes the area from the site.`)) return;
    setDeletingSlug(slug);
    try {
      const res = await fetch(`/api/areas/${slug}`, { method: "DELETE" });
      if (res.ok) {
        await loadAreas();
        router.refresh();
      }
    } finally {
      setDeletingSlug(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-[var(--gold)]/20">
        <div>
          <span className="section-label">Admin</span>
          <h1 className="text-3xl md:text-4xl font-heading gold-text mt-2">Service Areas</h1>
          <p className="text-cream/50 text-xs mt-1">Add new coverage areas — pages go live automatically.</p>
        </div>
        <Link
          href="/admin"
          className="self-start sm:self-auto px-4 py-2 text-xs uppercase tracking-widest border border-[var(--gold)]/40 text-cream rounded-sm hover:bg-[var(--gold)]/10 transition"
        >
          ← Back to Dashboard
        </Link>
      </header>

      {/* ── Add form ─────────────────────────────────────────────────── */}
      <section className="bg-black/20 border border-[var(--gold)]/20 rounded-sm p-5 sm:p-6 md:p-8 mb-10">
        <h2 className="text-xl md:text-2xl font-heading text-cream uppercase mb-2">Add New Area</h2>
        <p className="text-cream/40 text-xs mb-6">
          Service pages are generated automatically based on travel time. Pages appear within 5 minutes of saving.
        </p>

        <form onSubmit={handleAdd} className="grid gap-5 md:grid-cols-2">
          {/* Name */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">
              Area Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)] transition"
              placeholder="e.g. Chryston"
              required
            />
            {slugPreview && (
              <p className="text-xs text-cream/40 mt-1">
                URL: <span className="text-[var(--gold)]/70">/areas/{slugPreview}</span>
              </p>
            )}
          </div>

          {/* Postcodes */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">
              Postcode(s)
            </label>
            <input
              type="text"
              value={postcodes}
              onChange={(e) => setPostcodes(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)] transition"
              placeholder="e.g. G69 or G69, G71"
            />
            <p className="text-xs text-cream/40 mt-1">Separate multiple with commas</p>
          </div>

          {/* Council */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">
              Council <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={council}
              onChange={(e) => setCouncil(e.target.value)}
              list="council-list"
              className="w-full px-4 py-3 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)] transition"
              placeholder="e.g. North Lanarkshire"
              required
            />
            <datalist id="council-list">
              {COUNCILS.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>

          {/* Travel minutes */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">
              Travel Time from Base (minutes)
            </label>
            <input
              type="number"
              min={5}
              max={60}
              value={travelMinutes}
              onChange={(e) => setTravelMinutes(parseInt(e.target.value) || 20)}
              className="w-full px-4 py-3 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)] transition"
            />
            <p className="text-xs mt-1" style={{ color: travelMinutes <= 15 ? "#4ade80" : travelMinutes <= 22 ? "#facc15" : "#fb923c" }}>
              Services: {tierLabel(travelMinutes)}
            </p>
          </div>

          {/* Local hook */}
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">
              Local Description
            </label>
            <textarea
              value={localHook}
              onChange={(e) => setLocalHook(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)] transition resize-none"
              placeholder="e.g. Chryston sits on the north-eastern edge of Glasgow, where older bungalows and newer estates keep us busy with clearance and garden-waste work…"
            />
            <p className="text-xs text-cream/40 mt-1">2–3 sentences about the area and why people call us. Appears on the area page.</p>
          </div>

          {/* Landmarks */}
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">
              Landmarks / Notable Locations
            </label>
            <input
              type="text"
              value={landmarks}
              onChange={(e) => setLandmarks(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)] transition"
              placeholder="e.g. Chryston Village, Frankfield Loch, Marnoch Drive"
            />
            <p className="text-xs text-cream/40 mt-1">Separate with commas. Shown on the area page and used in SEO copy.</p>
          </div>

          {error && (
            <p className="md:col-span-2 text-sm text-red-400 bg-red-900/20 border border-red-900/40 rounded-sm p-3">
              {error}
            </p>
          )}
          {successMsg && (
            <p className="md:col-span-2 text-sm text-green-400 bg-green-900/20 border border-green-900/40 rounded-sm p-3">
              {successMsg}
            </p>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3 bg-[var(--gold)] text-[var(--forest-dark)] font-bold uppercase tracking-widest text-sm rounded-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Add Area"}
            </button>
          </div>
        </form>
      </section>

      {/* ── Custom areas list ────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl md:text-2xl font-heading text-cream uppercase mb-2">
          Custom Areas{" "}
          {areas.length > 0 && (
            <span className="text-cream/50 text-base normal-case">({areas.length})</span>
          )}
        </h2>
        <p className="text-cream/40 text-xs mb-6">
          Areas added here. The 50 built-in areas are always live and cannot be deleted from here.
        </p>

        {loading ? (
          <p className="text-cream/50">Loading…</p>
        ) : areas.length === 0 ? (
          <p className="text-cream/50">No custom areas yet. Add one above.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => {
              const postcodesParsed = (() => {
                try { return (JSON.parse(a.postcodes) as string[]).join(", "); }
                catch { return a.postcodes; }
              })();

              return (
                <div
                  key={a.slug}
                  className="bg-black/20 border border-[var(--gold)]/20 rounded-sm p-5"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-heading text-cream uppercase text-lg leading-tight">
                        {a.name}
                      </h3>
                      <p className="text-cream/40 text-xs mt-0.5">/areas/{a.slug}</p>
                    </div>
                    <ServiceTierBadge minutes={a.travel_minutes} />
                  </div>

                  <dl className="space-y-1 text-xs mb-4">
                    <div className="flex gap-2">
                      <dt className="text-cream/40 w-20 shrink-0">Council</dt>
                      <dd className="text-cream/80">{a.council}</dd>
                    </div>
                    {postcodesParsed && (
                      <div className="flex gap-2">
                        <dt className="text-cream/40 w-20 shrink-0">Postcodes</dt>
                        <dd className="text-cream/80">{postcodesParsed}</dd>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <dt className="text-cream/40 w-20 shrink-0">Travel</dt>
                      <dd className="text-cream/80">~{a.travel_minutes} min</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-cream/40 w-20 shrink-0">Added</dt>
                      <dd className="text-cream/80">{new Date(a.created_at).toLocaleDateString("en-GB")}</dd>
                    </div>
                  </dl>

                  <div className="flex gap-2">
                    <a
                      href={`/areas/${a.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 text-xs uppercase tracking-widest text-center text-[var(--gold)] border border-[var(--gold)]/40 rounded-sm hover:bg-[var(--gold)]/10 transition"
                    >
                      View page
                    </a>
                    <button
                      onClick={() => handleDelete(a.slug, a.name)}
                      disabled={deletingSlug === a.slug}
                      className="flex-1 py-2 text-xs uppercase tracking-widest text-red-400 border border-red-900/40 rounded-sm hover:bg-red-900/20 transition disabled:opacity-50"
                    >
                      {deletingSlug === a.slug ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
