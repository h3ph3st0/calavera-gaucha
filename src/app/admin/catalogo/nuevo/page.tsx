import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/app/admin/catalogo/actions";
import type { Universe } from "@/lib/catalog";

export const metadata: Metadata = { title: "Nuevo producto — Admin" };

const TENANT_SLUG = "calavera-gaucha";

export default async function NuevoProductoPage() {
  const supabase = createServiceClient();
  const { data: tenant } = await supabase
    .from("tenants").select("id").eq("slug", TENANT_SLUG).single();
  const { data: universesData } = await supabase
    .from("universes")
    .select("id, slug, name, tagline, description, theme, accent_color, icon, preview_image")
    .eq("tenant_id", tenant?.id ?? "")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const universes = (universesData ?? []).map((u) => ({
    id: u.id,
    slug: u.slug,
    name: u.name,
    tagline: u.tagline ?? "",
    description: u.description ?? "",
    theme: u.theme ?? "",
    accentColor: u.accent_color ?? "indigo",
    icon: u.icon ?? "🌟",
    previewImage: u.preview_image ?? undefined,
  })) as (Universe & { id: string })[];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/catalogo"
          className="mb-4 flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-secondary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Catálogo
        </Link>
        <h1 className="text-xl font-bold text-primary">Nuevo producto</h1>
      </div>
      <div className="rounded-2xl border border-white/8 bg-card p-6">
        <ProductForm action={createProduct} universes={universes} />
      </div>
    </div>
  );
}
