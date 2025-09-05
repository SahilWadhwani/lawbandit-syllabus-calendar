export async function extractFromDOCX(u8: Uint8Array): Promise<string> {
  const mod = await import("mammoth");
  const mammoth: any = (mod as any).default ?? (mod as any);
  const { value } = await mammoth.extractRawText({ buffer: Buffer.from(u8) });
  return (value ?? "").trim();
}
