export type LeadUrgency = "low" | "medium" | "high";
export type LeadUseType = "personal" | "business";

export interface LeadData {
  id?: string;
  name: string;
  description: string;
  category?: string;
  size?: string;
  material?: string;
  quantity: number;
  urgency: LeadUrgency;
  budgetRange?: string;
  useType?: LeadUseType;
  hasFiles?: boolean;
  fileNames?: string[];
  email?: string;
  whatsapp?: string;
}

const URGENCY_LABEL: Record<LeadUrgency, string> = {
  low: "Sin apuro",
  medium: "Tiene fecha aproximada",
  high: "⚠️ URGENTE",
};

const BUDGET_LABEL: Record<string, string> = {
  "hasta-5k": "hasta $5.000",
  "5k-15k": "$5.000 – $15.000",
  "15k-30k": "$15.000 – $30.000",
  "mas-30k": "más de $30.000",
};

export function buildWhatsAppLink(lead: LeadData): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const ref = lead.id ? `#${lead.id.slice(0, 8).toUpperCase()}` : "";

  const sections: (string | null)[] = [
    `🖨️ *Nuevo presupuesto — Calavera Gaucha*`,
    ref ? `Ref: ${ref}` : null,
    ``,
    `📋 *PEDIDO*`,
    `• ${lead.description}`,
    lead.category ? `• Tipo: ${lead.category}` : null,
    lead.useType ? `• Uso: ${lead.useType === "business" ? "🏢 Negocio / Empresa" : "👤 Personal"}` : null,
    ``,
    `📐 *ESPECIFICACIONES*`,
    `• Tamaño: ${lead.size && lead.size !== "no-se" ? lead.size : "a definir"}`,
    `• Material: ${lead.material && lead.material !== "no-se" ? lead.material : "a definir / asesorar"}`,
    `• Cantidad: ${lead.quantity} ${lead.quantity === 1 ? "unidad" : "unidades"}`,
    ``,
    lead.budgetRange && lead.budgetRange !== "sin-indicar"
      ? `💰 *PRESUPUESTO ESTIMADO*\n• ${BUDGET_LABEL[lead.budgetRange] ?? lead.budgetRange}`
      : null,
    lead.budgetRange && lead.budgetRange !== "sin-indicar" ? `` : null,
    `⏰ *URGENCIA*`,
    `• ${URGENCY_LABEL[lead.urgency]}`,
    ``,
    lead.hasFiles && lead.fileNames?.length
      ? `📎 *ARCHIVOS (${lead.fileNames.length})*\n${lead.fileNames.map((f) => `• ${f}`).join("\n")}\nLos comparto en este chat.`
      : lead.hasFiles
      ? `📎 *ARCHIVOS*\nTengo archivos para compartir en este chat.`
      : null,
    lead.hasFiles ? `` : null,
    `👤 *MI NOMBRE*`,
    `• ${lead.name}`,
  ];

  const text = sections.filter((l) => l !== null).join("\n");
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function buildAdminWhatsAppLink(
  phone: string,
  leadName: string,
  ref: string
): string {
  const text = `Hola ${leadName}, te contacto de Calavera Gaucha en relación a tu presupuesto ${ref}.`;
  const clean = phone.replace(/\D/g, "");
  const number = clean.startsWith("54") ? clean : `54${clean}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function calculateLeadScore(lead: Partial<LeadData>): number {
  let score = 10;

  // Contactabilidad
  if (lead.whatsapp) score += 25;
  if (lead.email) score += 5;

  // Urgencia (driver principal de conversión)
  if (lead.urgency === "high") score += 20;
  else if (lead.urgency === "medium") score += 12;
  else if (lead.urgency === "low") score += 4;

  // Volumen
  const qty = lead.quantity ?? 1;
  if (qty > 10) score += 12;
  else if (qty > 5) score += 8;
  else if (qty > 1) score += 4;

  // Tipo de uso (business = mayor LTV)
  if (lead.useType === "business") score += 15;

  // Presupuesto declarado (señal de intención real)
  if (lead.budgetRange && lead.budgetRange !== "sin-indicar") score += 10;

  // Calidad de la descripción
  const descLen = lead.description?.length ?? 0;
  if (descLen > 150) score += 8;
  else if (descLen > 80) score += 4;

  // Preparación técnica
  if (lead.hasFiles) score += 5;
  if (lead.size && lead.size !== "no-se") score += 3;
  if (lead.material && lead.material !== "no-se") score += 3;

  return Math.min(score, 100);
}
