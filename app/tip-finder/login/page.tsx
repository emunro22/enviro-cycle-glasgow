"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TipFinderLogin() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/tip-finder-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/tip-finder");
      router.refresh();
    } else {
      setError("Wrong PIN.");
      setPin("");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--forest-dark)" }}>
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl p-8" style={{ background: "linear-gradient(145deg, rgba(26,68,29,0.5), rgba(10,31,11,0.7))", border: "1px solid rgba(212,160,23,0.2)" }}>
        <h1 className="mb-6 text-3xl" style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.04em", color: "var(--cream)" }}>
          TIP <span className="gold-text">FINDER</span>
        </h1>
        <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(212,160,23,0.7)" }}>Enter PIN</p>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,160,23,0.18)", borderRadius: 12, padding: "14px 16px", color: "var(--cream)", fontSize: 18, width: "100%", outline: "none", letterSpacing: "0.4em", textAlign: "center" }}
        />
        {error && (<p className="mt-3 text-sm text-red-400">{error}</p>)}
        <button type="submit" disabled={loading || !pin} className="mt-5 w-full py-3 rounded-full font-semibold disabled:opacity-50" style={{ background: "linear-gradient(135deg, #d4a017, #f0c040)", color: "#0a1f0b" }}>
          {loading ? "Checking…" : "Unlock"}
        </button>
      </form>
    </main>
  );
}