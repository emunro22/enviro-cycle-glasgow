"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { BookingRow, BookingStatus } from "@/lib/db";
import { WASTE_CATEGORIES } from "@/lib/waste-categories";
import {
  getMonthGrid,
  toDateKey,
  addMonths,
  startOfDay,
  WEEKDAY_LABELS,
  MONTH_LABELS,
} from "@/lib/calendar-utils";

const labelFor = (key: string) => WASTE_CATEGORIES.find((c) => c.key === key)?.label ?? key;

function parseArr(json: string | null): string[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "No preference";
  return new Date(`${dateStr.slice(0, 10)}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_COLORS: Record<BookingStatus, string> = {
  new: "#f0c040",
  confirmed: "#57a45b",
  completed: "#8ac48d",
  cancelled: "#e08585",
};

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
      style={{ background: `${STATUS_COLORS[status]}22`, color: STATUS_COLORS[status], border: `1px solid ${STATUS_COLORS[status]}55` }}
    >
      {status}
    </span>
  );
}

function BookingDetails({ booking }: { booking: BookingRow }) {
  const access = parseArr(booking.access);
  const photos = parseArr(booking.photo_urls);
  return (
    <div className="mt-4 pt-4 space-y-3 text-sm" style={{ borderTop: "1px solid rgba(212,160,23,0.15)" }}>
      <div><span className="text-cream/40">Address: </span><span className="text-cream/85">{booking.address}</span></div>
      <div><span className="text-cream/40">Dismantling required: </span><span className="text-cream/85">{booking.dismantling ? "Yes" : "No"}</span></div>
      {booking.floor && <div><span className="text-cream/40">Floor: </span><span className="text-cream/85">{booking.floor}</span></div>}
      {access.length > 0 && <div><span className="text-cream/40">Access: </span><span className="text-cream/85">{access.join(", ")}</span></div>}
      {booking.additional_info && (
        <div><span className="text-cream/40">Comments: </span><span className="text-cream/85">{booking.additional_info}</span></div>
      )}
      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {photos.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <a key={url} href={url} target="_blank" rel="noopener noreferrer">
              <img src={url} alt="Booking photo" className="w-16 h-16 object-cover rounded-md" style={{ border: "1px solid rgba(212,160,23,0.25)" }} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking, onStatusChange }: { booking: BookingRow; onStatusChange: (id: number, status: BookingStatus) => void }) {
  const [expanded, setExpanded] = useState(false);
  const wasteTypes = parseArr(booking.waste_types);
  const wasteLocation = parseArr(booking.waste_location);

  return (
    <div className="bg-black/20 border border-[var(--gold)]/20 rounded-sm p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-cream font-semibold">{booking.first_name} {booking.last_name || ""}</p>
          <p className="text-cream/50 text-xs mt-0.5">
            {booking.email}{booking.phone ? ` · ${booking.phone}` : ""}
          </p>
          <p className="text-[var(--gold-light)] text-xs mt-1 font-semibold">{formatDate(booking.preferred_date)}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={booking.status} />
          {booking.estimated_quote && (
            <span className="text-cream/70 text-xs">Quoted: £{Number(booking.estimated_quote).toFixed(2)}</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {wasteTypes.map((t) => (
          <span key={t} className="text-[10px] px-2 py-1 rounded-full" style={{ background: "rgba(212,160,23,0.12)", color: "var(--gold-light)" }}>
            {labelFor(t)}
          </span>
        ))}
        {wasteLocation.map((l) => (
          <span key={l} className="text-[10px] px-2 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(245,240,232,0.7)" }}>
            {l}
          </span>
        ))}
      </div>

      {expanded && <BookingDetails booking={booking} />}

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3" style={{ borderTop: "1px solid rgba(212,160,23,0.1)" }}>
        <button onClick={() => setExpanded((v) => !v)} className="text-xs text-[var(--gold-light)] font-semibold">
          {expanded ? "Hide details ↑" : "View details ↓"}
        </button>
        <select
          value={booking.status}
          onChange={(e) => onStatusChange(booking.id, e.target.value as BookingStatus)}
          className="text-xs px-3 py-2 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)]"
        >
          <option value="new">New</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
}

export default function AdminBookingsPage() {
  const [view, setView] = useState<"calendar" | "list">("calendar");

  // Calendar view state
  const [cursor, setCursor] = useState(() => { const t = startOfDay(new Date()); return new Date(t.getFullYear(), t.getMonth(), 1); });
  const [monthBookings, setMonthBookings] = useState<BookingRow[]>([]);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [loadingMonth, setLoadingMonth] = useState(true);
  const [blockBusy, setBlockBusy] = useState(false);

  // List view state
  const [allBookings, setAllBookings] = useState<BookingRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loadingList, setLoadingList] = useState(true);

  const weeks = useMemo(() => getMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const monthKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;

  async function loadBlockedDates() {
    const res = await fetch(`/api/blocked-dates?t=${Date.now()}`, { cache: "no-store" });
    const data = await res.json();
    setBlockedDates(new Set(Array.isArray(data) ? data.map((r: { date: string }) => r.date.slice(0, 10)) : []));
  }

  async function loadMonthBookings() {
    setLoadingMonth(true);
    const res = await fetch(`/api/bookings?month=${monthKey}&t=${Date.now()}`, { cache: "no-store" });
    const data = await res.json();
    setMonthBookings(Array.isArray(data) ? data : []);
    setLoadingMonth(false);
  }

  async function loadAllBookings() {
    setLoadingList(true);
    const params = new URLSearchParams({ t: String(Date.now()) });
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/bookings?${params.toString()}`, { cache: "no-store" });
    const data = await res.json();
    setAllBookings(Array.isArray(data) ? data : []);
    setLoadingList(false);
  }

  useEffect(() => { loadBlockedDates(); }, []);
  useEffect(() => { loadMonthBookings(); setSelectedDateKey(null); }, [monthKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (view === "list") loadAllBookings(); }, [view, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, BookingRow[]>();
    for (const b of monthBookings) {
      if (!b.preferred_date) continue;
      const key = b.preferred_date.slice(0, 10);
      map.set(key, [...(map.get(key) ?? []), b]);
    }
    return map;
  }, [monthBookings]);

  async function handleStatusChange(id: number, status: BookingStatus) {
    setAllBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    setMonthBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function toggleBlock(dateKey: string) {
    setBlockBusy(true);
    try {
      if (blockedDates.has(dateKey)) {
        await fetch(`/api/blocked-dates?date=${dateKey}`, { method: "DELETE" });
      } else {
        await fetch("/api/blocked-dates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: dateKey, reason: "Blocked by admin" }),
        });
      }
      await loadBlockedDates();
    } finally {
      setBlockBusy(false);
    }
  }

  const selectedBookings = selectedDateKey ? bookingsByDate.get(selectedDateKey) ?? [] : [];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-[var(--gold)]/20">
        <div>
          <span className="section-label">Admin</span>
          <h1 className="text-3xl md:text-4xl font-heading gold-text mt-2">Bookings</h1>
          <p className="text-cream/50 text-xs mt-1">See who&apos;s booked in, when, and manage availability.</p>
        </div>
        <Link href="/admin" className="self-start sm:self-auto px-4 py-2 text-xs uppercase tracking-widest border border-[var(--gold)]/40 text-cream rounded-sm hover:bg-[var(--gold)]/10 transition">
          ← Back to Dashboard
        </Link>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["calendar", "list"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-5 py-2.5 text-xs uppercase tracking-widest rounded-sm transition"
            style={
              view === v
                ? { background: "var(--gold)", color: "var(--forest-dark)", fontWeight: 700 }
                : { background: "rgba(255,255,255,0.05)", color: "var(--cream)", border: "1px solid rgba(212,160,23,0.2)" }
            }
          >
            {v === "calendar" ? "Calendar" : "List"}
          </button>
        ))}
      </div>

      {view === "calendar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <section className="bg-black/20 border border-[var(--gold)]/20 rounded-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <button onClick={() => setCursor((c) => addMonths(c, -1))} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(212,160,23,0.1)", color: "var(--gold-light)" }}>‹</button>
              <span className="text-lg font-heading text-cream" style={{ letterSpacing: "0.06em" }}>
                {MONTH_LABELS[cursor.getMonth()]} {cursor.getFullYear()}
              </span>
              <button onClick={() => setCursor((c) => addMonths(c, 1))} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(212,160,23,0.1)", color: "var(--gold-light)" }}>›</button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAY_LABELS.map((d) => (
                <div key={d} className="text-center text-[10px] uppercase tracking-widest py-1 text-cream/40">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {weeks.flat().map((cell) => {
                const count = bookingsByDate.get(cell.dateKey)?.length ?? 0;
                const isBlocked = blockedDates.has(cell.dateKey);
                const isSelected = selectedDateKey === cell.dateKey;
                const isToday = cell.dateKey === toDateKey(startOfDay(new Date()));
                return (
                  <button
                    key={cell.dateKey}
                    onClick={() => setSelectedDateKey(cell.dateKey)}
                    className="aspect-square rounded-lg text-xs flex flex-col items-center justify-center gap-0.5 transition relative"
                    style={{
                      background: isSelected ? "linear-gradient(135deg, #d4a017, #f0c040)" : isBlocked ? "rgba(224,133,133,0.12)" : "transparent",
                      color: isSelected ? "#0a1f0b" : !cell.inMonth ? "rgba(245,240,232,0.15)" : "var(--cream)",
                      border: isToday && !isSelected ? "1px solid rgba(212,160,23,0.5)" : "1px solid transparent",
                    }}
                  >
                    {cell.date.getDate()}
                    {count > 0 && (
                      <span className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center" style={{ background: isSelected ? "#0a1f0b" : "var(--gold)", color: isSelected ? "var(--gold)" : "#0a1f0b" }}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {loadingMonth && <p className="text-cream/40 text-xs mt-3">Loading…</p>}
          </section>

          <section className="bg-black/20 border border-[var(--gold)]/20 rounded-sm p-5">
            {selectedDateKey ? (
              <>
                <h3 className="text-cream font-semibold mb-1">{formatDate(selectedDateKey)}</h3>
                <p className="text-cream/40 text-xs mb-4">
                  {selectedBookings.length} booking{selectedBookings.length === 1 ? "" : "s"}
                </p>
                <button
                  onClick={() => toggleBlock(selectedDateKey)}
                  disabled={blockBusy}
                  className="w-full mb-5 py-2.5 text-xs uppercase tracking-widest rounded-sm transition disabled:opacity-50"
                  style={
                    blockedDates.has(selectedDateKey)
                      ? { background: "rgba(87,164,91,0.15)", color: "#8ac48d", border: "1px solid rgba(87,164,91,0.4)" }
                      : { background: "rgba(224,133,133,0.12)", color: "#e08585", border: "1px solid rgba(224,133,133,0.4)" }
                  }
                >
                  {blockBusy ? "Saving…" : blockedDates.has(selectedDateKey) ? "Unblock this date" : "Block this date"}
                </button>
                <div className="space-y-3">
                  {selectedBookings.length === 0 ? (
                    <p className="text-cream/40 text-sm">No bookings on this date.</p>
                  ) : (
                    selectedBookings.map((b) => (
                      <div key={b.id} className="bg-black/20 border border-[var(--gold)]/10 rounded-sm p-3">
                        <p className="text-cream text-sm font-semibold">{b.first_name} {b.last_name || ""}</p>
                        <p className="text-cream/50 text-xs">{b.address}</p>
                        <div className="mt-2"><StatusBadge status={b.status} /></div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <p className="text-cream/40 text-sm">Select a date to see bookings and manage availability.</p>
            )}
          </section>
        </div>
      ) : (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <label className="text-xs uppercase tracking-widest text-cream/60">Filter:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-black/40 border border-[var(--gold)]/30 rounded-sm text-cream focus:outline-none focus:border-[var(--gold)]"
            >
              <option value="">All statuses</option>
              <option value="new">New</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loadingList ? (
            <p className="text-cream/50">Loading…</p>
          ) : allBookings.length === 0 ? (
            <p className="text-cream/50">No bookings yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {allBookings.map((b) => (
                <BookingCard key={b.id} booking={b} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
