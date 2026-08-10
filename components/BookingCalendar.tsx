"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getMonthGrid,
  toDateKey,
  startOfDay,
  addMonths,
  WEEKDAY_LABELS,
  MONTH_LABELS,
} from "@/lib/calendar-utils";

const MAX_MONTHS_AHEAD = 12;

type Props = {
  value: string | null;
  onChange: (dateKey: string) => void;
};

export default function BookingCalendar({ value, onChange }: Props) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blocked-dates", { cache: "no-store" })
      .then((res) => res.json())
      .then((rows: { date: string }[]) => {
        setBlockedDates(new Set(Array.isArray(rows) ? rows.map((r) => r.date.slice(0, 10)) : []));
      })
      .catch(() => setBlockedDates(new Set()))
      .finally(() => setLoading(false));
  }, []);

  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxMonth = addMonths(minMonth, MAX_MONTHS_AHEAD);

  const weeks = useMemo(() => getMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor]);

  const canGoPrev = cursor.getTime() > minMonth.getTime();
  const canGoNext = cursor.getTime() < maxMonth.getTime();

  return (
    <div
      className="rounded-2xl p-4 sm:p-5"
      style={{ background: "rgba(10,31,11,0.5)", border: "1px solid rgba(212,160,23,0.2)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => canGoPrev && setCursor((c) => addMonths(c, -1))}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="w-9 h-9 rounded-full flex items-center justify-center transition disabled:opacity-25"
          style={{ background: "rgba(212,160,23,0.1)", color: "var(--gold-light)" }}
        >
          ‹
        </button>
        <span
          className="text-base sm:text-lg font-semibold tracking-wide"
          style={{ fontFamily: "var(--font-heading)", color: "var(--cream)", letterSpacing: "0.06em" }}
        >
          {MONTH_LABELS[cursor.getMonth()]} {cursor.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => canGoNext && setCursor((c) => addMonths(c, 1))}
          disabled={!canGoNext}
          aria-label="Next month"
          className="w-9 h-9 rounded-full flex items-center justify-center transition disabled:opacity-25"
          style={{ background: "rgba(212,160,23,0.1)", color: "var(--gold-light)" }}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] sm:text-xs uppercase tracking-widest py-1"
            style={{ color: "rgba(245,240,232,0.4)" }}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((cell) => {
          const isPast = cell.date.getTime() < today.getTime();
          const isBlocked = blockedDates.has(cell.dateKey);
          const isSelected = value === cell.dateKey;
          const isToday = cell.dateKey === toDateKey(today);
          const disabled = isPast || isBlocked || !cell.inMonth;

          return (
            <button
              key={cell.dateKey}
              type="button"
              disabled={disabled || loading}
              onClick={() => onChange(cell.dateKey)}
              title={isBlocked ? "Unavailable" : undefined}
              className="aspect-square rounded-lg text-xs sm:text-sm font-medium transition flex items-center justify-center"
              style={{
                background: isSelected
                  ? "linear-gradient(135deg, #d4a017, #f0c040)"
                  : isToday
                  ? "rgba(212,160,23,0.15)"
                  : "transparent",
                color: isSelected
                  ? "#0a1f0b"
                  : !cell.inMonth
                  ? "rgba(245,240,232,0.15)"
                  : isPast || isBlocked
                  ? "rgba(245,240,232,0.2)"
                  : "var(--cream)",
                border: isToday && !isSelected ? "1px solid rgba(212,160,23,0.5)" : "1px solid transparent",
                textDecoration: isBlocked && cell.inMonth ? "line-through" : "none",
                cursor: disabled ? "default" : "pointer",
              }}
            >
              {cell.date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 text-[11px]" style={{ color: "rgba(245,240,232,0.45)" }}>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "linear-gradient(135deg, #d4a017, #f0c040)" }} />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ border: "1px solid rgba(212,160,23,0.5)" }} />
          Today
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(245,240,232,0.15)" }} />
          Unavailable
        </span>
      </div>
    </div>
  );
}
