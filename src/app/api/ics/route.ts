// src/app/api/ics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { itemsToIcs } from "@/lib/ics/build";
import type { SyllabusItem, ItemType } from "@/types/syllabus";

export const runtime = "nodejs";

// Accept undefined, then normalize to null.
const Item = z.object({
  id: z.string(),
  title: z.string(),
  type: z.custom<ItemType>(),               // keep your union type
  rawLine: z.string(),
  course: z.string().optional(),
  dueAt: z.string().nullable().optional(), // <-- allow undefined or null
  location: z.string().optional(),
  estimatedMinutes: z.number().optional(),
  notes: z.string().optional(),
});

const Body = z.object({
  items: z.array(Item).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { items } = Body.parse(json);

    // Normalize: dueAt undefined -> null to satisfy SyllabusItem
    const normalized: SyllabusItem[] = items.map((i) => ({
      ...i,
      dueAt: i.dueAt ?? null,
    }));

    const ics = itemsToIcs(normalized);

    return new NextResponse(ics, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": 'attachment; filename="syllabus-calendar.ics"',
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: err.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create calendar file" },
      { status: 500 }
    );
  }
}