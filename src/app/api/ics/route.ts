import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { itemsToIcs } from "@/lib/ics/build";
import { ItemType } from "@/types/syllabus";

const Item = z.object({
  id: z.string(),
  course: z.string().optional(),
  title: z.string(),
  type: z.custom<ItemType>(),
  rawLine: z.string(),
  dueAt: z.string().datetime().optional(),
  location: z.string().optional(),
  estimatedMinutes: z.number().optional(),
  notes: z.string().optional(),
});

const Body = z.object({ items: z.array(Item) });

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { items } = Body.parse(json);
  const ics = itemsToIcs(items);
  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="syllabus.ics"`,
    },
  });
}