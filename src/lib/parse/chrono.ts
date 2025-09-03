import * as chrono from "chrono-node";

export function parseDate(line: string, refDate = new Date()) {
  const result = chrono.parse(line, refDate, { forwardDate: true });
  if (result.length === 0) return undefined;
  const dt = result[0].date();
  return dt.toISOString();
}