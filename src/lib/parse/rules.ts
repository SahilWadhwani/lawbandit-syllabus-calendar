import { ItemType } from "@/types/syllabus";

const typeRules: Array<{ rx: RegExp; type: ItemType }> = [
  { rx: /\breading|read\b/i, type: "Reading" },
  { rx: /\bassignment\b/i, type: "Assignment" },
  { rx: /\bexam|midterm|final\b/i, type: "Exam" },
  { rx: /\bquiz\b/i, type: "Exam" },       // quizzes treated as exams
  { rx: /\blecture|class\b/i, type: "Lecture" },
  { rx: /\bmemo\b/i, type: "Assignment" }, // map "Memo" → Assignment
  { rx: /\bbrief\b/i, type: "Assignment" }, // map "Brief" → Assignment
  { rx: /\bcold\s*call\b/i, type: "Other" },
];