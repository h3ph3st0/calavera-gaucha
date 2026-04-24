import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { LeadsTable } from "@/components/admin/LeadsTable";
import type { QuoteStatus } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Leads — Admin" };
export const dynamic = "force-dynamic";

const STATUS_OPTIONS: { value: QuoteStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "new", label: "Nuevos" },
  { value: "contacted", label: "Contactados" },
  { value: "converted", label: "Convertidos" },
  { value: "lost", label: "Perdidos" },
];

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function LeadsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const activeStatus = (STATUS_OPTIONS.find((s) => s.value === status)?.value ?? "all") as QuoteStatus | "all";

  const supabase = await createServiceClient();

  let query = supabase
    .from("quotes")
    .select("id, name, email, whatsapp, description, size, material, quantity, urgency, status, lead_score, budget_range, use_type, admin_notes, created_at, updated_at")
    .order("lead_score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(100);

  if (activeStatus !== "all") {
    query = query.eq("status", activeStatus);
  }

  const { data: leads, error } = await query;

  if (error) {
    console.error("[admin/leads] fetch error", error);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Leads</h1>
          <p className="text-sm text-secondary">Ordenados por score · {leads?.length ?? 0} resultados</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <a
              key={opt.value}
              href={opt.value === "all" ? "/admin/leads" : `/admin/leads?status=${opt.value}`}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeStatus === opt.value
                  ? "bg-cta text-white shadow-sm shadow-cta/20"
                  : "border border-white/12 bg-card text-secondary hover:border-bronze/30 hover:text-primary"
              }`}
            >
              {opt.label}
            </a>
          ))}
        </div>
      </div>

      {!leads || leads.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-card py-16 text-center">
          <p className="text-secondary">No hay leads {activeStatus !== "all" ? `con estado "${activeStatus}"` : "aún"}.</p>
        </div>
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  );
}
