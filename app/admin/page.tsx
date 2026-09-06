"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: number;
  title: string;
  category: string;
  image_url: string;
  display_order: number;
  created_at: string;
};

const CATEGORY_SUGGESTIONS = ["Removal", "Landscaping", "Specialist", "Commercial", "Residential"];

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadProjects() {
    setLoading(true);
    const res = await fetch(`/api/projects?t=${Date.now()}`, { cache: "no-store" });
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Upload failed");
    }
    const data = await res.json();
    return data.url;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!title || !category || !file) {
      setError("Title, category, and image are required.");
      return;
    }

    setSubmitting(true);
    try {
      const image_url = await uploadFile(file);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          display_order: displayOrder,
          image_url,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      // Reset form
      setTitle("");
      setCategory("");
      setDisplayOrder(0);
      setFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      const input = document.getElementById("imageInput") as HTMLInputElement | null;
      if (input) input.value = "";

      setSuccessMsg("Project added. It will appear on the homepage within a few seconds.");
      await loadProjects();
      // Trigger a router refresh so the homepage re-renders if the user navigates back
      router.refresh();

      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project? The image will be permanently removed.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadProjects();
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 md:mb-10 pb-6 border-b border-[var(--gold)]/20">
        <div>
          <span className="section-label">Admin</span>
          <h1 className="text-3xl md:text-4xl font-heading gold-text mt-2">Dashboard</h1>
          <p className="text-cream/50 text-xs mt-1">Manage your site content.</p>
        </div>
        <button
          onClick={handleLogout}
          className="self-start sm:self-auto px-4 py-2 text-xs uppercase tracking-widest border border-[var(--gold)]/40 text-cream rounded-sm hover:bg-[var(--gold)]/10 transition"
        >
          Sign out
        </button>
      </header>

      {/* ── Nav tiles ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <a
          href="/admin/bookings"
          className="block bg-black/20 border border-[var(--gold)]/20 rounded-sm p-6 hover:border-[var(--gold)]/50 transition"
        >
          <p className="text-[var(--gold)] text-xs font-bold uppercase tracking-widest mb-1">Bookings</p>
          <p className="text-cream/60 text-sm mb-4">See what&apos;s booked in: calendar and list views, block dates, update status.</p>
          <span className="text-xs text-[var(--gold-light)] font-semibold">Manage bookings →</span>
        </a>
        <a
          href="/admin/pricing"
          className="block bg-black/20 border border-[var(--gold)]/20 rounded-sm p-6 hover:border-[var(--gold)]/50 transition"
        >
          <p className="text-[var(--gold)] text-xs font-bold uppercase tracking-widest mb-1">Pricing</p>
          <p className="text-cream/60 text-sm mb-4">Set the price customers are quoted for each waste type when they book.</p>
          <span className="text-xs text-[var(--gold-light)] font-semibold">Manage pricing →</span>
        </a>
        <a
          href="/admin/areas"
          className="block bg-black/20 border border-[var(--gold)]/20 rounded-sm p-6 hover:border-[var(--gold)]/50 transition"
        >
          <p className="text-[var(--gold)] text-xs font-bold uppercase tracking-widest mb-1">Service Areas</p>
          <p className="text-cream/60 text-sm mb-4">Add new coverage areas. Pages and service listings go live automatically.</p>
          <span className="text-xs text-[var(--gold-light)] font-semibold">Manage areas →</span>
        </a>
        <div className="bg-black/20 border border-[var(--gold)]/20 rounded-sm p-6">
          <p className="text-[var(--gold)] text-xs font-bold uppercase tracking-widest mb-1">Work Gallery</p>
          <p className="text-cream/60 text-sm mb-4">Add, remove and reorder project photos shown on the homepage.</p>
          <p className="text-cream/40 text-xs">You&apos;re already here. Scroll down to manage.</p>
        </div>
      </div>

      <hr className="border-[var(--gold)]/10 mb-10" />
      <h2 className="text-xl md:text-2xl font-heading text-cream uppercase mb-6">Work Gallery</h2>

      <section className="bg-black/20 border border-[var(--gold)]/20 rounded-sm p-5 sm:p-6 md:p-8 mb-10 md:mb-12">
        <h2 className="text-xl md:text-2xl font-heading text-cream uppercase mb-5 md:mb-6">Add New Project</h2>
        <form onSubmit={handleAdd} className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)] transition text-base"
              placeholder="e.g. Garden Clearance, Bearsden"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              list="category-list"
              className="w-full px-4 py-3 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)] transition text-base"
              placeholder="e.g. Removal"
              required
            />
            <datalist id="category-list">
              {CATEGORY_SUGGESTIONS.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">Display Order</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)] transition text-base"
              placeholder="Lower = shows first"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">Image</label>
            <label
              htmlFor="imageInput"
              className="block w-full cursor-pointer border-2 border-dashed border-[var(--gold)]/40 rounded-sm p-6 text-center hover:border-[var(--gold)] transition"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-sm object-contain" />
              ) : (
                <div className="text-cream/60">
                  <p className="text-sm uppercase tracking-widest mb-2">Tap to choose an image</p>
                  <p className="text-xs">or take a photo</p>
                </div>
              )}
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>
            {file && (
              <p className="text-xs text-cream/50 mt-2 truncate">
                {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
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
              {submitting ? "Uploading…" : "Add Project"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-xl md:text-2xl font-heading text-cream uppercase mb-5 md:mb-6">
          Existing Projects {projects.length > 0 && <span className="text-cream/50 text-base normal-case">({projects.length})</span>}
        </h2>

        {loading ? (
          <p className="text-cream/50">Loading…</p>
        ) : projects.length === 0 ? (
          <p className="text-cream/50">No projects yet. Add one above.</p>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div key={p.id} className="bg-black/20 border border-[var(--gold)]/20 rounded-sm overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image_url} alt={p.title} className="w-full aspect-square object-cover" />
                <div className="p-4 sm:p-5">
                  <p className="text-[var(--gold)] text-xs font-bold uppercase tracking-widest mb-1">
                    {p.category}
                  </p>
                  <h3 className="font-heading text-cream uppercase text-base sm:text-lg mb-3 leading-tight">{p.title}</h3>
                  <div className="flex items-center justify-between text-xs text-cream/40 mb-4">
                    <span>Order: {p.display_order}</span>
                    <span>{new Date(p.created_at).toLocaleDateString("en-GB")}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="w-full py-2.5 text-xs uppercase tracking-widest text-red-400 border border-red-900/40 rounded-sm hover:bg-red-900/20 transition disabled:opacity-50"
                  >
                    {deletingId === p.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}