// src/lib/extract/repair.ts
import { PDFDocument } from "pdf-lib";

/**
 * Rewrite the PDF by copying all pages into a fresh PDF.
 * This often fixes XRef / trailer inconsistencies so pdf-parse can read text.
 */
export async function rewritePdf(u8: Uint8Array): Promise<Uint8Array> {
  // Be permissive when loading
  const src = await PDFDocument.load(u8, {
    ignoreEncryption: true,
    throwOnInvalidObject: false,
    updateMetadata: false,
  });
  const dst = await PDFDocument.create();
  const indices = src.getPageIndices();
  const pages = await dst.copyPages(src, indices);
  for (const p of pages) dst.addPage(p);
  const out = await dst.save();
  return new Uint8Array(out);
}