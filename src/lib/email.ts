// Notificaciones por email via Resend REST API (sin dependencias extra).
// Configura RESEND_API_KEY y ADMIN_EMAIL en las variables de entorno.
// Si no están configuradas, la función retorna sin hacer nada (graceful degradation).

export interface SaasLeadData {
  nombre: string;
  negocio: string;
  rubro: string;
  whatsapp: string;
  email?: string;
  redes?: string;
  mensaje: string;
}

export async function sendSaasLeadNotification(data: SaasLeadData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!apiKey || !adminEmail) return;

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://calaveragaucha.com.ar";

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#111;color:#eee;">
  <h2 style="color:#E67E22;margin:0 0 4px">🚀 Nuevo lead SaaS</h2>
  <p style="color:#aaa;margin:0 0 20px">Alguien quiere una web para su negocio</p>

  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:6px 0;color:#aaa;width:140px">Contacto</td><td style="padding:6px 0;color:#fff;font-weight:600">${data.nombre}</td></tr>
    <tr><td style="padding:6px 0;color:#aaa">Negocio</td><td style="padding:6px 0;color:#fff">${data.negocio}</td></tr>
    <tr><td style="padding:6px 0;color:#aaa">Rubro</td><td style="padding:6px 0;color:#fff">${data.rubro}</td></tr>
    <tr><td style="padding:6px 0;color:#aaa">WhatsApp</td><td style="padding:6px 0;color:#fff">${data.whatsapp}</td></tr>
    ${data.email ? `<tr><td style="padding:6px 0;color:#aaa">Email</td><td style="padding:6px 0;color:#fff">${data.email}</td></tr>` : ""}
    ${data.redes ? `<tr><td style="padding:6px 0;color:#aaa">Redes</td><td style="padding:6px 0;color:#fff">${data.redes}</td></tr>` : ""}
  </table>

  <div style="margin:20px 0;padding:16px;background:#1a1a1a;border-radius:8px;border-left:3px solid #E67E22;">
    <p style="margin:0;color:#aaa;font-size:12px;margin-bottom:8px">MENSAJE</p>
    <p style="margin:0;color:#eee">${data.mensaje.replace(/\n/g, "<br>")}</p>
  </div>

  <a href="https://wa.me/${data.whatsapp.replace(/\D/g, "")}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">
    Responder por WhatsApp →
  </a>
</body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "Calavera Gaucha <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `[SAAS] ${data.negocio} · ${data.nombre}`,
        html,
      }),
    });
    if (!res.ok) console.error("[email] Resend saas error:", res.status, await res.text());
  } catch (err) {
    console.error("[email] fetch error:", err);
  }
}

export interface QuoteEmailData {
  quoteId: string;
  name: string;
  whatsapp?: string | null;
  email?: string | null;
  description: string;
  leadScore: number;
  urgency: string;
  quantity: number;
  fileCount?: number;
}

const URGENCY_LABEL: Record<string, string> = {
  low: "Sin apuro",
  medium: "Con fecha",
  high: "URGENTE ⚡",
};

export async function sendNewQuoteNotification(data: QuoteEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || !adminEmail) return;

  const ref = data.quoteId.slice(0, 8).toUpperCase();
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://calavera-gaucha.vercel.app";
  const urgency = URGENCY_LABEL[data.urgency] ?? data.urgency;

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#111;color:#eee;">
  <h2 style="color:#E67E22;margin:0 0 4px">Nuevo presupuesto #${ref}</h2>
  <p style="color:#aaa;margin:0 0 20px">Score: <strong style="color:${data.leadScore >= 70 ? "#4ade80" : data.leadScore >= 45 ? "#E67E22" : "#888"}">${data.leadScore}/100</strong></p>

  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:6px 0;color:#aaa;width:120px">Nombre</td><td style="padding:6px 0;color:#fff;font-weight:600">${data.name}</td></tr>
    <tr><td style="padding:6px 0;color:#aaa">Urgencia</td><td style="padding:6px 0;color:#fff">${urgency}</td></tr>
    <tr><td style="padding:6px 0;color:#aaa">Cantidad</td><td style="padding:6px 0;color:#fff">${data.quantity} ud.</td></tr>
    ${data.whatsapp ? `<tr><td style="padding:6px 0;color:#aaa">WhatsApp</td><td style="padding:6px 0;color:#fff">${data.whatsapp}</td></tr>` : ""}
    ${data.email ? `<tr><td style="padding:6px 0;color:#aaa">Email</td><td style="padding:6px 0;color:#fff">${data.email}</td></tr>` : ""}
    ${data.fileCount ? `<tr><td style="padding:6px 0;color:#aaa">Archivos</td><td style="padding:6px 0;color:#fff">${data.fileCount} adjunto(s)</td></tr>` : ""}
  </table>

  <div style="margin:20px 0;padding:16px;background:#1a1a1a;border-radius:8px;border-left:3px solid #E67E22;">
    <p style="margin:0;color:#aaa;font-size:12px;margin-bottom:8px">PEDIDO</p>
    <p style="margin:0;color:#eee">${data.description.replace(/\n/g, "<br>")}</p>
  </div>

  <a href="${siteUrl}/admin/leads" style="display:inline-block;background:#E67E22;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">
    Ver en el panel →
  </a>
</body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "Calavera Gaucha <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `[CG] #${ref} · Score ${data.leadScore} · ${data.name}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[email] Resend error:", res.status, err);
    }
  } catch (err) {
    console.error("[email] fetch error:", err);
  }
}
