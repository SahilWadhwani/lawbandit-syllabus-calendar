// src/types/syllabus.ts

export type ItemType = "Reading" | "Assignment" | "Exam" | "Lecture" | "Other";

export interface SyllabusItem {
  id: string;
  title: string;
  type: ItemType;
  dueAt: string | null;   // ISO date "YYYY-MM-DD" or null if not parsed
  notes?: string;
}

export interface ParseStats {
  totalLines: number;
  parsedItems: number;
  withDates: number;
}

export interface ParseResult {
  items: SyllabusItem[];
  warnings: string[];
  stats: ParseStats;
}

// also used by /api/extract
export type ExtractDebug = {
  bytes: number;
  pdfHeaderOk?: boolean;
  approxPages?: number;
  charsPerPage?: number;
};

export type ExtractResult = {
  text: string;
  textLength: number;
  mime: string;
  debug: ExtractDebug;
};