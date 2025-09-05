import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/extract";
import { ACCEPTED_MIME, MAX_BYTES } from "@/lib/utils/files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mime = file.type || "application/octet-stream";
    const size = file.size ?? 0;

    // Basic validations
    if (!(ACCEPTED_MIME as readonly string[]).includes(mime)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${mime}. Please upload PDF, DOCX, or TXT.` },
        { status: 400 }
      );
    }
    if (size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large. Max size is ${(MAX_BYTES / 1024 / 1024).toFixed(1)} MB.` },
        { status: 400 }
      );
    }

    const u8 = new Uint8Array(await file.arrayBuffer());
    const result = await extractTextFromFile(u8, mime, u8.length);

    // result: { text, textLength, mime, debug }
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Extract failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}