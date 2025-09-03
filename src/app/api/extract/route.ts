import { NextRequest, NextResponse } from "next/server";
import { extractText } from "@/lib/extract";

export const runtime = "nodejs"; // Needed for pdfjs on Vercel

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const arrayBuf = await file.arrayBuffer();
  const buf = Buffer.from(arrayBuf);
  const mime = file.type || "application/octet-stream";

  try {
    const text = await extractText(buf, mime);
    return NextResponse.json({ text });
  } catch (e: unknown) {
  const message = e instanceof Error ? e.message : "extract failed";
  return NextResponse.json({ error: message }, { status: 500 });
}
}