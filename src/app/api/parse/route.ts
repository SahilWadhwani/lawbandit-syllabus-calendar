import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseSyllabusText } from "@/lib/parse/pipeline";

const Body = z.object({
  text: z.string().min(1, "Text content is required"),
});

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = Body.parse(body);

    const result = parseSyllabusText(text);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof z.ZodError) {
      // ⬅️ use .issues rather than .errors
      return NextResponse.json(
        { error: "Invalid request", details: e.issues },
        { status: 400 }
      );
    }
    const msg = e instanceof Error ? e.message : "Parse failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}