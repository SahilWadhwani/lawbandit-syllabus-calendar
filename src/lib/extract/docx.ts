import mammoth from "mammoth";

export async function extractDocxText(file: Buffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ buffer: file });
  return value ?? "";
}