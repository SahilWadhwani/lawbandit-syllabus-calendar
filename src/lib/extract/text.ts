export async function extractFromText(u8: Uint8Array): Promise<string> {
  // plain UTF-8
  return Buffer.from(u8).toString("utf8").replace(/\u0000/g, "").trim();
}
