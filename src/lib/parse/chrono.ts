import * as chrono from "chrono-node";
import { toISODate } from "@/lib/utils/dates";

/** Try to parse a date in `s`. If not found, return null. */
export function tryDate(s: string, base?: Date): string | null {
  const ref = base ?? new Date();
  const date = chrono.parseDate(s, ref, { forwardDate: true });
  if (!date) return null;
  return toISODate(date);
}
