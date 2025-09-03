export type ItemType = "Reading" | "Assignment" | "Exam" | "Quiz" | "Brief" | "Memo" | "Cold Call" | "Lecture" | "Other";

export interface SyllabusItem {
  id: string;
  course?: string;
  title: string;
  type: ItemType;
  rawLine: string;
  dueAt?: string;
  location?: string;
  estimatedMinutes?: number;
  notes?: string;
}

export interface ParseResult {
  items: SyllabusItem[];
  warnings: string[];
  stats: {
    totalLines: number;
    parsedItems: number;
    withDates: number;
  };
}