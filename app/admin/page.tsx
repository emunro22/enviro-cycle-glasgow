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

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadProjects() {
    setLoading(true);
    const res = await fetch("/api/projects", { cache: "no-store" });
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");

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

      setTitle("");
      setCategory("");
      setDisplayOrder(0);
      setFile(null);
      (document.getElementById("imageInput") as HTMLInputElement).value = "";
      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project? The image will be permanently removed.")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) await loadProjects();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <header className="flex items-center justify-between mb-10 pb-6 border-b border-[var(--gold)]/20">
        <div>
          <span className="section-label">Admin</span>
          <h1 className="text-4xl font-heading gold-text mt-2">Work Gallery</h1>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-xs uppercase tracking-widest border border-[var(--gold)]/40 text-cream rounded-sm hover:bg-[var(--gold)]/10 transition"
        >
          Sign out
        </button>
      </header>

      <section className="bg-black/20 border border-[var(--gold)]/20 rounded-sm p-8 mb-12">
        <h2 className="text-2xl font-heading text-cream uppercase mb-6">Add New Project</h2>
        <form onSubmit={handleAdd} className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)] transition"
              placeholder="e.g. Garden Clearance — Bearsden"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)] transition"
              placeholder="e.g. Removal, Landscaping, Specialist"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">Display Order</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)] transition"
              placeholder="Lower number shows first"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-widest text-cream/70 mb-2">Image</label>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-cream/70 file:mr-3 file:py-2 file:px-4 file:rounded-sm file:border-0 file:bg-[var(--gold)] file:text-[var(--forest-dark)] file:font-bold file:uppercase file:tracking-widest file:text-xs file:cursor-pointer"
              required
            />
          </div>

          {error && <p className="md:col-span-2 text-sm text-red-400">{error}</p>}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-[var(--gold)] text-[var(--forest-dark)] font-bold uppercase tracking-widest text-sm rounded-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? "Uploading…" : "Add Project"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-heading text-cream uppercase mb-6">
          Existing Projects {projects.length > 0 && <span className="text-cream/50 text-base normal-case">({projects.length})</span>}
        </h2>

        {loading ? (
          <p className="text-cream/50">Loading…</p>
        ) : projects.length === 0 ? (
          <p className="text-cream/50">No projects yet. Add one above.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <div key={p.id} className="bg-black/20 border border-[var(--gold)]/20 rounded-sm overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image_url} alt={p.title} className="w-full aspect-square object-cover" />
                <div className="p-5">
                  <p className="text-[var(--gold)] text-xs font-bold uppercase tracking-widest mb-1">
                    {p.category}
                  </p>
                  <h3 className="font-heading text-cream uppercase text-lg mb-3">{p.title}</h3>
                  <div className="flex items-center justify-between text-xs text-cream/40 mb-4">
                    <span>Order: {p.display_order}</span>
                    <span>{new Date(p.created_at).toLocaleDateString("en-GB")}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="w-full py-2 text-xs uppercase tracking-widest text-red-400 border border-red-900/40 rounded-sm hover:bg-red-900/20 transition"
                  >
                    Delete
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