// Shared month-grid date math used by both the customer BookingCalendar
// and the admin bookings calendar view. Keeps the grid layout identical
// between the two without duplicating the arithmetic.

export type CalendarCell = {
  date: Date;
  dateKey: string; // YYYY-MM-DD, local
  inMonth: boolean;
};

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addMonths(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

// Monday-start week grid, always full weeks (padded with the days
// bordering the month so the calendar has no gaps).
export function getMonthGrid(year: number, month: number): CalendarCell[][] {
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // 0 = Monday

  const gridStart = new Date(year, month, 1 - firstWeekday);

  const weeks: CalendarCell[][] = [];
  let cursor = gridStart;
  for (let w = 0; w < 6; w++) {
    const week: CalendarCell[] = [];
    for (let d = 0; d < 7; d++) {
      week.push({
        date: cursor,
        dateKey: toDateKey(cursor),
        inMonth: cursor.getMonth() === month,
      });
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  // Trim trailing all-next-month weeks beyond what's needed (keep grid tidy).
  while (
    weeks.length > 4 &&
    weeks[weeks.length - 1].every((cell) => !cell.inMonth)
  ) {
    weeks.pop();
  }

  return weeks;
}
