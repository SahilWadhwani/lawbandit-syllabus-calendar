import { createEvents, type EventAttributes } from "ics";
import { SyllabusItem } from "@/types/syllabus";

export function itemsToIcs(items: SyllabusItem[]): string {
  const events: EventAttributes[] = items
    .filter((i) => i.dueAt)
    .map((i) => {
      const dt = new Date(i.dueAt!);

      const evt: EventAttributes = {
        title: `[${i.type}] ${i.title}`,
        start: [dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate()],
        duration: { days: 1 }, 
        description: i.notes ?? i.rawLine,
        location: i.location,
      };

      return evt;
    });

  const { error, value } = createEvents(events);
  if (error || !value) throw (error ?? new Error("Failed to build ICS"));
  return value;
}