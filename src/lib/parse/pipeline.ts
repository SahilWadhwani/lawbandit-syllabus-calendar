import { normalizeLine, looksLikeHeader, isLikelyNoise } from "./score";
import { tryDate } from "./chrono";
import type { ParseResult, SyllabusItem } from "@/types/syllabus";

/** Light classifier by keyword buckets. */
function classify(title: string): SyllabusItem["type"] {
  const t = title.toLowerCase();
  if (/(reading|read|chapter|ch\.|pp\.)\b/.test(t)) return "Reading";
  if (/(assignment|hw|homework|submit|due|draft|paper|memo)\b/.test(t)) return "Assignment";
  if (/(exam|midterm|final|quiz|test)\b/.test(t)) return "Exam";
  if (/(class|lecture|seminar|session)\b/.test(t)) return "Lecture";
  return "Other";
}

/** Merge soft-wrapped lines: if next starts lowercase and is not a header/noise, join. */
function unwrapLines(lines: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    let cur = lines[i];
    const next = lines[i + 1];
    if (
      cur &&
      next &&
      !/[.!?;:]$/.test(cur) &&
      /^[a-z(]/.test(next) &&
      !looksLikeHeader(next) &&
      !isLikelyNoise(next) &&
      cur.length + next.length < 180
    ) {
      out.push((cur + " " + next).trim());
      i++; // skip next
    } else {
      out.push(cur);
    }
  }
  return out;
}

/** Strip trailing reading page-parens like "(pp. 12–34)". */
function stripReadingParen(s: string): string {
  return s.replace(/\((pp?\.)[^)]+\)\.?$/i, "").trim();
}

export function parseSyllabusText(text: string): ParseResult {
  const rawLines = text.split(/\n+/);
  const norm = rawLines.map(normalizeLine).filter(Boolean);
  const lines = unwrapLines(norm);

  const items: SyllabusItem[] = [];
  let currentDate: string | null = null;

  for (const line of lines) {
    if (isLikelyNoise(line)) continue;

    // Header establishes context date (if any)
    if (looksLikeHeader(line)) {
      currentDate = tryDate(line) ?? currentDate;
      // continue scanning; headers sometimes also contain real items
    }

    // Prefer inline date, else fall back to header date
    const inlineDate = tryDate(line, currentDate ? new Date(currentDate) : undefined);
    const dueAt = inlineDate ?? currentDate;

    // Create candidate title
    let title = stripReadingParen(line);
    // Drop obvious pure-date headers as items (if nothing content-ish)
    const wordCount = title.split(/\s+/).filter(Boolean).length;
    if (!dueAt && (wordCount <= 2 || looksLikeHeader(title))) continue;

    const type = classify(title);

    // De-dup by (title + date)
    const key = `${title}@@${dueAt ?? ""}`;
    if (items.some((i) => `${i.title}@@${i.dueAt ?? ""}` === key)) continue;

    items.push({
      id: `${items.length + 1}`,
      title,
      type,
      dueAt: dueAt ?? null,
    });
  }

  const withDates = items.filter((i) => i.dueAt).length;

  const warnings: string[] = [];
  if (items.length > 0 && withDates / items.length < 0.4) {
    warnings.push(
      "Fewer than 40% of lines produced dated items. Consider uploading a more text-based copy (e.g., 'Save as PDF') or DOCX."
    );
  }

  return {
    items,
    warnings,
    stats: {
      totalLines: rawLines.length,
      parsedItems: items.length,
      withDates,
    },
  };
}
