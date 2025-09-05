/** Collapse weird whitespace, normalize dashes, strip bullets. */
export function normalizeLine(s: string): string {
  let t = s.replace(/\r/g, "").replace(/\s+/g, " ").trim();
  t = t.replace(/[–—]/g, "-"); // en/em-dash → dash
  // common bullets / numbering
  t = t.replace(/^(\s*[\u2022\-\*\•\·\u25CF]+|\s*\(?[0-9A-Za-z]+\)|\s*[0-9]+\.)(\s+)/, "");
  return t;
}

/** Lines that are probably noise: too short, symbol-ish, or just times. */
export function isLikelyNoise(s: string): boolean {
  if (!s) return true;
  if (s.length < 3) return true;
  if (/^\(?[0-9]{1,2}:\d{2}\)?\s*([ap]\.?m\.?)?$/i.test(s)) return true; // just a time
  const symbolRatio = (s.match(/[^A-Za-z0-9\s]/g)?.length ?? 0) / s.length;
  if (symbolRatio > 0.5 && s.length < 20) return true;
  return false;
}

/** Headers that often contain the primary date context. */
export function looksLikeHeader(s: string): boolean {
  if (/^week\s*\d+\b/i.test(s)) return true;
  if (/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(s)) return true;
  if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\b/i.test(s)) return true;
  if (/^\d{1,2}\s*[-/]\s*\d{1,2}\s*[-/]\s*\d{2,4}\b/.test(s)) return true;
  return false;
}
