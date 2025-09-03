import { extractPdfText } from "./pdf";
import { extractDocxText } from "./docx";
import { extractPlainText } from "./text";

export type SupportedMime =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "text/plain";

export async function extractText(buf: Buffer, mime: string): Promise<string> {
  if (mime === "application/pdf") return extractPdfText(buf);
  if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return extractDocxText(buf);
  if (mime === "text/plain") return extractPlainText(buf);
  return extractPlainText(buf);
}