import type { ExtractResult } from "@/types/syllabus";
import { extractFromPDF, checkPDFHeader, estimatePDFPages } from "./pdf";
import { extractFromDOCX } from "./docx";
import { extractFromText } from "./text";

export async function extractTextFromFile(
  u8: Uint8Array,
  mime: string,
  fileSize: number
): Promise<ExtractResult> {
  let text = "";
  const debug: ExtractResult["debug"] = { bytes: fileSize };

  if (mime === "application/pdf") {
    debug.pdfHeaderOk = checkPDFHeader(u8);
    if (!debug.pdfHeaderOk) {
      throw new Error("Invalid PDF header. Try re-saving as a text-based PDF.");
    }
    debug.approxPages = estimatePDFPages(fileSize);
    text = await extractFromPDF(u8);
    if (text) debug.charsPerPage = Math.round(text.length / (debug.approxPages || 1));
  } else if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    text = await extractFromDOCX(u8);
  } else if (mime === "text/plain") {
    text = await extractFromText(u8);
  } else {
    throw new Error(`Unsupported file type: ${mime}`);
  }

  if (!text || text.length < 10) {
    if (mime === "application/pdf") {
      throw new Error(
        "No embedded text found. If this is a scanned PDF, please upload a text-based PDF, DOCX, or TXT."
      );
    }
    throw new Error("No text content found in this file.");
  }

  return { text, textLength: text.length, mime, debug };
}
