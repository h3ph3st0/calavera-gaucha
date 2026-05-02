"use client";

import { useState, useTransition } from "react";
import { MessageCircle, ChevronDown, ChevronUp, StickyNote, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateLeadStatus, updateLeadNotes } from "@/app/admin/leads/actions";
import { buildAdminWhatsAppLink } from "@/lib/whatsapp";
import type { QuoteStatus } from "@/lib/supabase/types";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface QuoteFile {
  name: string;
  url: string;
  size: number;
}

interface Lead {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  description: string;
  size: string | null;
  material: string | null;
  quantity: number;
  urgency: "low" | "medium" | "high";
  status: QuoteStatus;
  lead_score: number;
  budget_range: string | null;
  use_type: "personal" | "business" | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-success/15 text-success" :
    score >= 45 ? "bg-bronze/15 text-bronze" :
    "bg-white/8 text-muted";

  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold tabular-nums", color)}>
      {score}
    </span>
  );
}

const STATUS_CONFIG: Record<QuoteStatus, { label: string; color: string }> = {
  new:       { label: "Nuevo",       color: "bg-anime/15 text-anime" },
  contacted: { label: "Contactado",  color: "bg-warning/15 text-warning" },
  converted: { label: "Convertido",  color: "bg-success/15 text-success" },
  lost:      { label: "Perdido",     color: "bg-white/8 text-muted" },
};

const URGENCY_CONFIG = {
  low:    { label: "Sin apuro",  color: "text-muted" },
  medium: { label: "Con fecha",  color: "text-bronze" },
  high:   { label: "Urgente",    color: "text-danger font-semibold" },
};

const BUDGET_LABEL: Record<string, string> = {
  "hasta-5k": "hasta $5k",
  "5k-15k": "$5k–$15k",
  "15k-30k": "$15k–$30k",
  "mas-30k": "+$30k",
};

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = MONTHS[d.getMonth()];
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${hh}:${mm}`;
}

// ─── Fila individual ──────────────────────────────────────────────────────────

function LeadRow({ lead, files }: { lead: Lead; files: QuoteFile[] }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<QuoteStatus>(lead.status);
  const [notes, setNotes] = useState(lead.admin_notes ?? "");
  const [editingNotes, setEditingNotes] = useState(false);
  const [isPending, startTransition] = useTransition();

  const ref = lead.id.slice(0, 8).toUpperCase();
  const waLink = lead.whatsapp
    ? buildAdminWhatsAppLink(lead.whatsapp, lead.name, `#${ref}`)
    : null;

  function handleStatusChange(newStatus: QuoteStatus) {
    setStatus(newStatus);
    startTransition(async () => {
      await updateLeadStatus(lead.id, newStatus);
    });
  }

  function handleSaveNotes() {
    startTransition(async () => {
      await updateLeadNotes(lead.id, notes);
      setEditingNotes(false);
    });
  }

  return (
    <div className={cn("rounded-2xl border border-white/8 bg-card transition-opacity", isPending && "opacity-60")}>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex shrink-0 flex-col items-center gap-1 sm:pt-1">
          <ScoreBadge score={lead.lead_score} />
          <span className="text-[10px] text-muted">score</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-primary">{lead.name}</span>
            {lead.use_type === "business" && (
              <span className="rounded-full bg-anime/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-anime">
                Negocio
              </span>
            )}
            <span className={cn("text-xs", URGENCY_CONFIG[lead.urgency].color)}>
              {URGENCY_CONFIG[lead.urgency].label}
            </span>
            {lead.budget_range && lead.budget_range !== "sin-indicar" && (
              <span className="text-xs text-muted">{BUDGET_LABEL[lead.budget_range] ?? lead.budget_range}</span>
            )}
          </div>

          <p className="mt-1 line-clamp-2 text-sm text-secondary">{lead.description}</p>

          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
            {lead.size && <span>📐 {lead.size}</span>}
            {lead.material && lead.material !== "no-se" && <span>🎨 {lead.material}</span>}
            <span>🔢 {lead.quantity} ud.</span>
            {files.length > 0 && (
              <span className="flex items-center gap-1 text-bronze">
                <Paperclip className="h-3 w-3" />
                {files.length} archivo{files.length !== 1 ? "s" : ""}
              </span>
            )}
            <span>#{ref}</span>
            <span>{formatDate(lead.created_at)}</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as QuoteStatus)}
            className={cn(
              "rounded-full border-0 px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-bronze/30",
              STATUS_CONFIG[status].color
            )}
          >
            {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
              <option key={val} value={val}>{cfg.label}</option>
            ))}
          </select>

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WA
            </a>
          )}

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-full p-1.5 text-muted transition-colors hover:bg-base hover:text-secondary"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/8 px-4 pb-4 pt-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Contacto</p>
              <dl className="space-y-1 text-sm text-primary">
                {lead.whatsapp && (
                  <div><dt className="inline text-muted">WA: </dt><dd className="inline">{lead.whatsapp}</dd></div>
                )}
                {lead.email && (
                  <div><dt className="inline text-muted">Email: </dt><dd className="inline">{lead.email}</dd></div>
                )}
              </dl>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Pedido completo</p>
              <p className="text-sm text-primary">{lead.description}</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <div className="mb-1.5 flex items-center gap-1.5">
                <Paperclip className="h-3.5 w-3.5 text-muted" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Archivos adjuntos</p>
              </div>
              <div className="space-y-1.5">
                {files.map((f, i) => (
                  <a
                    key={i}
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-white/12 bg-base px-3 py-2 text-sm transition-colors hover:border-bronze/30"
                  >
                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted" />
                    <span className="min-w-0 flex-1 truncate text-primary">{f.name}</span>
                    <span className="shrink-0 text-xs text-muted">{formatBytes(f.size)}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <div className="mb-1.5 flex items-center gap-1.5">
              <StickyNote className="h-3.5 w-3.5 text-muted" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Notas internas</p>
            </div>
            {editingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Notas sobre este lead..."
                  className="w-full resize-none rounded-xl border border-white/12 bg-base px-3 py-2 text-sm text-primary placeholder:text-muted focus:border-bronze focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={isPending}
                    className="rounded-lg bg-cta px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-cta-dark disabled:opacity-60"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setNotes(lead.admin_notes ?? ""); setEditingNotes(false); }}
                    className="rounded-lg border border-white/12 px-3 py-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-base"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditingNotes(true)}
                className="w-full rounded-xl border border-dashed border-white/15 px-3 py-2 text-left text-sm text-muted transition-colors hover:border-bronze/40 hover:text-bronze"
              >
                {notes || "Agregar nota..."}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tabla principal ──────────────────────────────────────────────────────────

export function LeadsTable({
  leads,
  filesByLeadId,
}: {
  leads: Lead[];
  filesByLeadId: Record<string, QuoteFile[]>;
}) {
  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <LeadRow key={lead.id} lead={lead} files={filesByLeadId[lead.id] ?? []} />
      ))}
    </div>
  );
}
