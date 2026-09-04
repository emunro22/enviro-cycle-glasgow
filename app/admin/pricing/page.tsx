"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { WastePriceRow } from "@/lib/db";

export default function AdminPricingPage() {
  const [prices, setPrices] = useState<WastePriceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function loadPrices() {
    setLoading(true);
    const res = await fetch(`/api/prices?t=${Date.now()}`, { cache: "no-store" });
    const data = await res.json();
    setPrices(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadPrices();
  }, []);

  function handlePriceChange(category: string, value: string) {
    setPrices((prev) =>
      prev.map((p) => (p.category === category ? { ...p, price: value } : p))
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSaving(true);
    try {
      const res = await fetch("/api/prices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prices: prices.map((p) => ({ category: p.category, price: p.price })),
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      setPrices(Array.isArray(data) ? data : []);
      setSuccessMsg("Prices saved. New bookings will be quoted using these prices immediately.");
      setTimeout(() => setSuccessMsg(""), 6000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-[var(--gold)]/20">
        <div>
          <span className="section-label">Admin</span>
          <h1 className="text-3xl md:text-4xl font-heading gold-text mt-2">Pricing</h1>
          <p className="text-cream/50 text-xs mt-1">
            Set the price shown to customers for each waste category when they book online.
          </p>
        </div>
        <Link
          href="/admin"
          className="self-start sm:self-auto px-4 py-2 text-xs uppercase tracking-widest border border-[var(--gold)]/40 text-cream rounded-sm hover:bg-[var(--gold)]/10 transition"
        >
          ← Back to Dashboard
        </Link>
      </header>

      <section className="bg-black/20 border border-[var(--gold)]/20 rounded-sm p-5 sm:p-6 md:p-8">
        <p className="text-cream/40 text-xs mb-6">
          When a customer books online and selects one or more waste types, they're emailed
          a quote starting from the <strong className="text-cream/70">lowest</strong> price among
          their selected categories.
        </p>

        {loading ? (
          <p className="text-cream/50">Loading…</p>
        ) : (
          <form onSubmit={handleSave}>
            <div className="grid gap-4 sm:grid-cols-2">
              {prices.map((p) => (
                <div key={p.category} className="flex items-center justify-between gap-4 bg-black/20 border border-[var(--gold)]/10 rounded-sm p-4">
                  <label htmlFor={`price-${p.category}`} className="text-sm text-cream/80">
                    {p.label}
                  </label>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-cream/50 text-sm">£</span>
                    <input
                      id={`price-${p.category}`}
                      type="number"
                      min={0}
                      step="0.01"
                      inputMode="decimal"
                      value={p.price}
                      onChange={(e) => handlePriceChange(p.category, e.target.value)}
                      className="w-24 px-3 py-2 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream text-right focus:outline-none focus:border-[var(--gold)] transition"
                    />
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <p className="mt-6 text-sm text-red-400 bg-red-900/20 border border-red-900/40 rounded-sm p-3">
                {error}
              </p>
            )}
            {successMsg && (
              <p className="mt-6 text-sm text-green-400 bg-green-900/20 border border-green-900/40 rounded-sm p-3">
                {successMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full sm:w-auto px-8 py-3 bg-[var(--gold)] text-[var(--forest-dark)] font-bold uppercase tracking-widest text-sm rounded-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save All"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
