import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { Pagination } from "@/components/admin/Pagination";
import type { QuoteStatus } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Leads — Admin" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

const STATUS_OPTIONS: { value: QuoteStatus | "all"; label: string }[] = [
  { value: "all",       label: "Todos"       },
  { value: "new",       label: "Nuevos"      },
  { value: "contacted", label: "Contactados" },
  { value: "converted", label: "Convertidos" },
  { value: "lost",      label: "Perdidos"    },
];

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function LeadsPage({ searchParams }: Props) {
  const { status, page: pageParam } = await searchParams;
  const activeStatus = (
    STATUS_OPTIONS.find((s) => s.value === status)?.value ?? "all"
  ) as QuoteStatus | "all";

  const page = Math.max(1, parseInt(pageParam ?? "1") || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to   = from + PAGE_SIZE - 1;

  const supabase = createServiceClient();

  // Consulta de conteo (HEAD, sin filas)
  let countQ = supabase.from("quotes").select("*", { count: "exact", head: true });
  if (activeStatus !== "all") countQ = countQ.eq("status", activeStatus);
  const { count } = await countQ;

  // Consulta de datos paginada
  let dataQ = supabase
    .from("quotes")
    .select(
      "id, name, email, whatsapp, description, size, material, quantity, urgency, status, lead_score, budget_range, use_type, admin_notes, created_at, updated_at"
    )
    .order("lead_score", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);
  if (activeStatus !== "all") dataQ = dataQ.eq("status", activeStatus);

  const { data: leads, error } = await dataQ;
  if (error) console.error("[admin/leads] fetch error", error);

  const totalCount  = count ?? 0;
  const totalPages  = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Leads</h1>
          <p className="text-sm text-secondary">
            Ordenados por score · {totalCount} en total
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <a
              key={opt.value}
              href={
                opt.value === "all"
                  ? "/admin/leads"
                  : `/admin/leads?status=${opt.value}`
              }
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
          <p className="text-secondary">
            No hay leads{activeStatus !== "all" ? ` con estado "${activeStatus}"` : " aún"}.
          </p>
        </div>
      ) : (
        <>
          <LeadsTable leads={leads} />
          {totalPages > 1 && (
            <Pagination
              page={safePage}
              totalPages={totalPages}
              totalCount={totalCount}
              status={activeStatus !== "all" ? activeStatus : undefined}
            />
          )}
        </>
      )}
    </div>
  );
}
