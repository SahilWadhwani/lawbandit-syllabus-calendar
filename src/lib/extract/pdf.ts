// src/lib/extract/pdf.ts
export async function extractFromPDF(u8: Uint8Array): Promise<string> {
  const parse = async (bytes: Uint8Array) => {
    const mod = await import("pdf-parse/lib/pdf-parse.js").catch(() => import("pdf-parse"));
    const pdfParse: any = (mod as any).default ?? (mod as any);
    const res = await pdfParse(Buffer.from(bytes));
    return (res?.text ?? "").trim();
  };

  try {
    return await parse(u8);
  } catch (err: any) {
    const msg = String(err?.message || err || "");
    // Typical messages: "bad XRef entry", "Invalid xref", "trailer", etc.
    const looksLikeXref = /xref|x-ref|trailer|object stream|bad xref/i.test(msg);
    if (!looksLikeXref) throw err;

    try {
      const { rewritePdf } = await import("./repair");
      const repaired = await rewritePdf(u8);
      return await parse(repaired);
    } catch (retryErr) {
      console.error("PDF repair retry failed:", retryErr);
      // Surface the original useful message to the user
      throw new Error(
        "The PDF seems malformed (xref/trailer error). Try re-saving it as PDF (e.g., Print → Save as PDF) or upload a DOCX/TXT version."
      );
    }
  }
}

export function checkPDFHeader(u8: Uint8Array): boolean {
  if (u8.length < 5) return false;
  const head = Buffer.from(u8.slice(0, 5)).toString("utf8");
  return head.startsWith("%PDF-");
}

export function estimatePDFPages(bytes: number): number {
  return Math.max(1, Math.round(bytes / (200 * 1024)));
}