export function normalize(raw: string): string {
  let t = raw.replace(/\r\n/g, "\n").replace(/\t/g, " ").replace(/[ \u00A0]+/g, " ");
  t = t.replace(/\n{3,}/g, "\n\n");
  return t.trim();
}

export function toLines(t: string): string[] {
  return t.split("\n").map(l => l.trim()).filter(Boolean);
}