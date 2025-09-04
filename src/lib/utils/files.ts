// src/lib/utils/files.ts
export const ACCEPTED_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const;

export const MAX_BYTES = 15 * 1024 * 1024; // 15MB

export function humanSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0, b = bytes;
  while (b >= 1024 && i < units.length - 1) { b /= 1024; i++; }
  return `${b.toFixed(1)} ${units[i]}`;
}