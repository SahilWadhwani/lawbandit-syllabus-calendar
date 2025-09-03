export async function extractPlainText(file: Buffer): Promise<string> {
  return file.toString("utf8");
}