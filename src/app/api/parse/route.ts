import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseSyllabusText } from "@/lib/parse/pipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const schema = z.object({ text: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = schema.parse(body);
    const result = parseSyllabusText(text);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request", details: e.errors }, { status: 400 });
    }
    const msg = e instanceof Error ? e.message : "Parse failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
