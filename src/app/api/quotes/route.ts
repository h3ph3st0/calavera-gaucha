import { NextResponse, type NextRequest } from "next/server";
import { quoteSchema } from "@/lib/validations/quote";
import { checkRateLimit, getClientIp, sanitizeText } from "@/lib/security/sanitize";
import { calculateLeadScore } from "@/lib/whatsapp";
import { createServiceClient } from "@/lib/supabase/server";

const TENANT_SLUG = "calavera-gaucha";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(ip, 5, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Esperá un momento." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const data = parsed.data;
  data.description = sanitizeText(data.description);
  if (data.size) data.size = sanitizeText(data.size);
  if (data.material) data.material = sanitizeText(data.material);

  // El score viene calculado del cliente; lo recalculamos server-side como fuente de verdad
  const leadScore = calculateLeadScore({
    whatsapp: data.whatsapp,
    email: data.email,
    urgency: data.urgency,
    quantity: data.quantity,
    useType: data.use_type,
    budgetRange: data.budget_range,
    description: data.description,
    size: data.size,
    material: data.material,
  });

  try {
    const supabase = await createServiceClient();

    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("id")
      .eq("slug", TENANT_SLUG)
      .single();

    if (tenantError || !tenant) {
      console.error("[quotes] tenant not found", tenantError);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }

    const { data: quote, error } = await supabase
      .from("quotes")
      .insert({
        tenant_id: tenant.id,
        name: data.name,
        email: data.email || null,
        whatsapp: data.whatsapp || null,
        description: data.description,
        size: data.size || null,
        material: data.material || null,
        urgency: data.urgency,
        quantity: data.quantity,
        budget_range: data.budget_range || null,
        use_type: data.use_type || null,
        lead_score: leadScore,
        ip_address: ip,
        user_agent: request.headers.get("user-agent") ?? null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[quotes] insert error", error);
      return NextResponse.json({ error: "No se pudo guardar el presupuesto" }, { status: 500 });
    }

    return NextResponse.json({ id: quote.id, leadScore }, { status: 201 });
  } catch (err) {
    console.error("[quotes] unexpected error", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
