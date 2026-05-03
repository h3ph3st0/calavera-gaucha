import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { formatPrice, CATEGORY_LABELS, type Category } from "@/lib/catalog";

export const metadata: Metadata = { title: "Catálogo — Admin" };
export const dynamic = "force-dynamic";

const TENANT_SLUG = "calavera-gaucha";

export default async function AdminCatalogoPage() {
  const supabase = createServiceClient();
  const { data: tenant } = await supabase
    .from("tenants").select("id").eq("slug", TENANT_SLUG).single();

  const [{ data: products }, { data: universesData }] = await Promise.all([
    supabase
      .from("products")
      .select("id, slug, name, category_slug, base_price, is_high_rotation, is_active, universe_id")
      .eq("tenant_id", tenant?.id ?? "")
      .order("category_slug", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("universes")
      .select("id, name")
      .eq("tenant_id", tenant?.id ?? ""),
  ]);
  const universeNameMap = new Map((universesData ?? []).map((u) => [u.id, u.name]));

  const grouped: Record<string, typeof products> = {};
  for (const p of products ?? []) {
    const cat = p.category_slug ?? "sin categoría";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat]!.push(p);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Catálogo de productos</h1>
          <p className="text-sm text-secondary">{products?.length ?? 0} productos</p>
        </div>
        <Link
          href="/admin/catalogo/nuevo"
          className="flex items-center gap-1.5 rounded-xl bg-cta px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cta/20 transition-colors hover:bg-cta-dark"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      {!products?.length ? (
        <div className="rounded-2xl border border-white/8 bg-card py-16 text-center">
          <p className="text-secondary">No hay productos aún.</p>
          <Link href="/admin/catalogo/nuevo" className="mt-4 inline-block text-sm text-bronze hover:text-cta">
            Creá el primero →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                {CATEGORY_LABELS[cat as Category] ?? cat}
              </p>
              <div className="space-y-2">
                {(items ?? []).map((p) => {
                  const universeName = p.universe_id ? universeNameMap.get(p.universe_id) : null;
                  return (
                    <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-card px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-semibold text-primary">{p.name}</p>
                          {universeName && (
                            <span className="rounded-full bg-layer px-2 py-0.5 text-[10px] text-muted">
                              {universeName}
                            </span>
                          )}
                          {p.is_high_rotation && (
                            <span className="rounded-full bg-cta/10 px-2 py-0.5 text-[10px] font-semibold text-cta">
                              alta rotación
                            </span>
                          )}
                          {!p.is_active && (
                            <span className="rounded-full bg-layer px-2 py-0.5 text-[10px] text-muted">
                              inactivo
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-muted">
                          {formatPrice(p.base_price ?? undefined)} · {p.slug}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/catalogo/${p.id}/editar`}
                          className="rounded-lg p-2 text-secondary transition-colors hover:bg-layer hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteProductButton productId={p.id} name={p.name} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-white/8 bg-card p-4">
        <p className="text-sm font-semibold text-primary">Universos</p>
        <p className="mt-1 text-xs text-secondary">
          Los 4 universos temáticos son editables desde{" "}
          <Link href="/admin/universos" className="text-bronze hover:text-cta">
            /admin/universos
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
