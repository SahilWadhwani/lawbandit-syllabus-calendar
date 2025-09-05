// src/lib/utils/dates.ts

/** ISO date (YYYY-MM-DD) from a JS Date in UTC, no time. */
export function toISODate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = d.getUTCDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Value for <input type="date"> from an ISO date (YYYY-MM-DD) or null. */
export function isoToDateInput(iso?: string | null): string {
  if (!iso) return "";
  // Accept either full ISO or already date-only; normalize to YYYY-MM-DD
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : "";
}

/** Convert an <input type="date"> value (YYYY-MM-DD) to ISO (YYYY-MM-DD) or null. */
export function dateInputToISO(input: string): string | null {
  if (!input) return null;
  // Construct a UTC date to avoid timezone drift
  const [y, m, d] = input.split("-").map((n) => parseInt(n, 10));
  if (!y || !m || !d) return null;
  const dt = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
  return toISODate(dt);
}