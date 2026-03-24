import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn required helper
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ── Date formatters ───────────────────────────────────────────────────────────

export function formatDate(value) {
  if (!value) return "—";
  const date = typeof value === "number" ? new Date(value) : new Date(value);
  return date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function formatDateShort(value) {
  if (!value) return "—";
  const date = typeof value === "number" ? new Date(value) : new Date(value);
  return date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── Chart helpers ─────────────────────────────────────────────────────────────

// Group submissions by date (YYYY-MM-DD)
export function groupByDate(submissions) {
  const map = {};
  submissions.forEach((s) => {
    const date = new Date(s.submitted_at);
    const key = date.toISOString().split("T")[0];
    map[key] = (map[key] || 0) + 1;
  });

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

// Returns an array of the last 30 days with submission counts (0 if none)
export function getLast30Days(submissions) {
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });

  const grouped = groupByDate(submissions);
  const map = Object.fromEntries(
    grouped.map(({ date, count }) => [date, count]),
  );

  return days.map((date) => ({ date, count: map[date] ?? 0 }));
}
