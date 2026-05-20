"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Incorrect PIN");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--forest-dark)] p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-black/30 border border-[var(--gold)]/30 rounded-sm p-10 shadow-2xl"
      >
        <span className="section-label">Admin</span>
        <h1 className="text-3xl font-heading gold-text mt-3 mb-1">Sign In</h1>
        <p className="text-cream/60 text-sm mb-6">Enter your admin PIN to continue.</p>

        <label className="block text-cream/70 text-xs uppercase tracking-widest mb-2">PIN</label>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full px-4 py-3 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)] transition"
          autoFocus
          required
        />

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 bg-[var(--gold)] text-[var(--forest-dark)] font-bold uppercase tracking-widest text-sm rounded-sm hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}