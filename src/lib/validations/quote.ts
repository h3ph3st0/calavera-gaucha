import { z } from "zod";

export const quoteSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100).trim(),
  email: z.string().max(200).optional(),
  whatsapp: z.string().max(20).optional().transform((v) => v?.replace(/\D/g, "")),
  description: z.string().min(10, "Describí el pedido con al menos 10 caracteres").max(2000).trim(),
  size: z.string().trim().max(100).optional(),
  material: z.string().trim().max(100).optional(),
  urgency: z.enum(["low", "medium", "high"]),
  quantity: z.number().int().min(1).max(1000),
  budget_range: z.string().optional(),
  use_type: z.enum(["personal", "business"]).optional(),
  lead_score: z.number().int().min(0).max(100).optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

// ── Validación de archivos (cliente y servidor) ────────────────────────────────

const ALLOWED_EXTENSIONS = new Set([
  "stl", "obj", "3mf", "step", "stp",
  "png", "jpg", "jpeg", "webp", "zip",
]);

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
export const MAX_FILES = 5;

export function sanitizeFilename(name: string): string {
  const base = name.substring(0, name.lastIndexOf(".")) || name;
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const safeBase = base
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 60);
  return ext ? `${safeBase}.${ext}` : safeBase;
}

export interface FileValidationResult {
  valid: boolean;
  safeName: string;
  error?: string;
}

export function validateFile(file: File): FileValidationResult {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const safeName = sanitizeFilename(file.name);

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, safeName, error: `Tipo no permitido (.${ext})` };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, safeName, error: "Supera el límite de 50 MB" };
  }
  return { valid: true, safeName };
}

// Verifica magic bytes para imágenes. Retorna true para archivos 3D (sin firma estándar).
export async function validateFileMagicBytes(file: File): Promise<boolean> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!["png", "jpg", "jpeg", "webp"].includes(ext)) return true;

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  if (ext === "png") {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }
  if (ext === "jpg" || ext === "jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (ext === "webp") {
    const isRiff = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
    const isWebp = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
    return isRiff && isWebp;
  }

  return false;
}
