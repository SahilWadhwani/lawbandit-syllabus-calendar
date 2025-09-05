// src/lib/ics/build.ts
import { createEvents, EventAttributes } from "ics";
import type { SyllabusItem } from "@/types/syllabus";

export function itemsToIcs(items: SyllabusItem[]): string {
  const dated = items.filter((i) => i.dueAt);

  const events: EventAttributes[] = dated.map((i) => {
    const [y, m, d] = (i.dueAt as string).split("-").map((n) => Number(n));
    return {
      title: `${i.type}: ${i.title}`,
      start: [y, m, d],
      startType: "date",
      duration: { days: 1 },
      description: i.notes || `${i.type} item from syllabus`,
      status: "CONFIRMED",
      busyStatus: "FREE",
      categories: [i.type],
    };
  });

  const { error, value } = createEvents(events);

  if (error || !value) {
    throw error || new Error("Failed to generate ICS");
  }
  return value;
}