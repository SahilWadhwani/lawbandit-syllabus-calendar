// Node-friendly legacy build (avoids DOM APIs like DOMMatrix)
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

export async function extractPdfText(file: Buffer): Promise<string> {
  // No worker setup in Node.
  const doc = await pdfjs.getDocument({
    data: file,
    isEvalSupported: false,
    useWorkerFetch: false,
    disableFontFace: true,
  }).promise;

  let text = "";

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const items = content.items as TextItem[];
    const pageText = items.map((it) => it.str).join(" ");
    text += pageText + "\n";
  }

  return text;
}