import { normalize, toLines } from "./normalize";
import { parseDate } from "./chrono";
import { inferType } from "./rules";
import { ParseResult, SyllabusItem } from "@/types/syllabus";
import { randomUUID } from "crypto";

export async function parseSyllabusText(raw: string): Promise<ParseResult> {
  const t = normalize(raw);
  const lines = toLines(t);
  const items: SyllabusItem[] = [];
  const warnings: string[] = [];

  for (const line of lines) {
    const dueAt = parseDate(line);
    if (dueAt || /\bdue\b/i.test(line) || /\bread(ing)?\b/i.test(line)) {
      items.push({
        id: randomUUID(),
        title: line.length > 140 ? line.slice(0, 137) + "…" : line,
        type: inferType(line),
        rawLine: line,
        dueAt,
      });
    }
  }

  const withDates = items.filter(i => i.dueAt).length;
  if (withDates < Math.max(2, Math.floor(items.length * 0.2))) {
    warnings.push("Low date density detected. This syllabus may be organized by week headings or relative dates.");
  }

  return {
    items,
    warnings,
    stats: {
      totalLines: lines.length,
      parsedItems: items.length,
      withDates,
    },
  };
}