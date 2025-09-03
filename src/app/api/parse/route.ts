import { NextRequest, NextResponse } from "next/server";
import { parseSyllabusText } from "@/lib/parse/pipeline";
import { z } from "zod";

const Body = z.object({ text: z.string().min(1) });

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { text } = Body.parse(json);
  const result = await parseSyllabusText(text);
  return NextResponse.json(result);
}