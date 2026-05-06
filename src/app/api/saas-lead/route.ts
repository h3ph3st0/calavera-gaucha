import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/security/ratelimit";
import { getClientIp, sanitizeText } from "@/lib/security/sanitize";
import { sendSaasLeadNotification } from "@/lib/email";

const saasLeadSchema = z.object({
  nombre:   z.string().min(2).max(100),
  negocio:  z.string().min(2).max(100),
  rubro:    z.string().min(2).max(100),
  whatsapp: z.string().min(8).max(20),
  email:    z.string().email().optional().or(z.literal("")),
  redes:    z.string().max(200).optional(),
  mensaje:  z.string().min(10).max(1000),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = await checkRateLimit(ip, 3, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Esperá un momento." }, { status: 429 });
  }

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Payload inválido" }, { status: 400 }); }

  const parsed = saasLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const data = parsed.data;

  await Promise.race([
    sendSaasLeadNotification({
      nombre:   sanitizeText(data.nombre),
      negocio:  sanitizeText(data.negocio),
      rubro:    sanitizeText(data.rubro),
      whatsapp: data.whatsapp,
      email:    data.email || undefined,
      redes:    data.redes ? sanitizeText(data.redes) : undefined,
      mensaje:  sanitizeText(data.mensaje),
    }).catch(() => {}),
    new Promise<void>((r) => setTimeout(r, 2500)),
  ]);

  return NextResponse.json({ ok: true }, { status: 201 });
}
