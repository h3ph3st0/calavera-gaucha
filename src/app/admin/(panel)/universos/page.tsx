import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Pencil } from "lucide-react";

export const metadata: Metadata = { title: "Universos — Admin" };
export const dynamic = "force-dynamic";

const TENANT_SLUG = "calavera-gaucha";

export default async function AdminUniversosPage() {
  const supabase = createServiceClient();
  const { data: tenant } = await supabase
    .from("tenants").select("id").eq("slug", TENANT_SLUG).single();

  const { data: universes } = await supabase
    .from("universes")
    .select("id, slug, name, tagline, icon, is_active")
    .eq("tenant_id", tenant?.id ?? "")
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-primary">Universos temáticos</h1>
        <p className="text-sm text-secondary">Los 4 universos del catálogo.</p>
      </div>

      <div className="space-y-3">
        {(universes ?? []).map((u) => (
          <div key={u.id} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-card p-4">
            <span className="text-3xl">{u.icon ?? "🌟"}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-primary">{u.name}</p>
                {!u.is_active && (
                  <span className="rounded-full bg-layer px-2 py-0.5 text-[10px] text-muted">inactivo</span>
                )}
              </div>
              <p className="text-sm text-muted">{u.tagline ?? "—"}</p>
            </div>
            <Link
              href={`/admin/universos/${u.id}/editar`}
              className="rounded-lg p-2 text-secondary transition-colors hover:bg-layer hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
