import { ItemType } from "@/types/syllabus";

const typeRules: Array<{ rx: RegExp; type: ItemType }> = [
  { rx: /\b(midterm|final|exam)\b/i, type: "Exam" },
  { rx: /\b(reading|read:\s|pp?\.)\b/i, type: "Reading" },
  { rx: /\b(assignment|hw|homework|deliverable|due)\b/i, type: "Assignment" },
  { rx: /\b(brief)\b/i, type: "Brief" },
  { rx: /\b(memo)\b/i, type: "Memo" },
  { rx: /\b(quiz)\b/i, type: "Quiz" },
  { rx: /\b(cold\s*call)\b/i, type: "Cold Call" },
  { rx: /\b(lecture|class)\b/i, type: "Lecture" },
];

export function inferType(line: string): ItemType {
  for (const r of typeRules) {
    if (r.rx.test(line)) return r.type;
  }
  return "Other";
}