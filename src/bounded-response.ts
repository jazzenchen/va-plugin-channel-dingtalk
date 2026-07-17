export const MAX_MEDIA_BYTES = 20 * 1024 * 1024;

export function assertDeclaredSizeWithinLimit(headers: Record<string, unknown>, limit = MAX_MEDIA_BYTES): void {
  const raw = headers["content-length"];
  const declared = typeof raw === "string" || typeof raw === "number" ? Number(raw) : Number.NaN;
  if (Number.isFinite(declared) && declared > limit) {
    throw new Error(`media response exceeds ${limit} bytes`);
  }
}
