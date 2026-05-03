import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/app/admin/(panel)/catalogo/actions";
import type { Product, Universe, Category, UniverseSlug } from "@/lib/catalog";

export const metadata: Metadata = { title: "Editar producto — Admin" };

const TENANT_SLUG = "calavera-gaucha";

type PrefillJson = {
  description: string;
  category: string;
  size?: string;
  material?: string;
};

type RawProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  category_slug: string | null;
  base_price: number | null;
  size_range: string | null;
  material: string | null;
  is_high_rotation: boolean;
  tags: string[];
  image_url: string | null;
  prefill: unknown;
  is_active: boolean;
  universe_id: string | null;
};

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: tenant } = await supabase
    .from("tenants").select("id").eq("slug", TENANT_SLUG).single();

  const [{ data: rawData }, { data: universesData }] = await Promise.all([
    supabase
      .from("products")
      .select("id, slug, name, tagline, description, category_slug, base_price, size_range, material, is_high_rotation, tags, image_url, prefill, is_active, universe_id")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("universes")
      .select("id, slug, name, tagline, description, theme, accent_color, icon, preview_image")
      .eq("tenant_id", tenant?.id ?? "")
      .eq("is_active", true)
      .order("created_at", { ascending: true }),
  ]);

  const raw = rawData as RawProduct | null;
  if (!raw) notFound();

  const prefill = (raw.prefill ?? {}) as PrefillJson;

  // Resolve universe slug from universes list
  const currentUniverseId = raw.universe_id ?? undefined;
  const universeEntry = universesData?.find((u) => u.id === raw.universe_id);

  const product: Product & { id: string; is_active: boolean } = {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    tagline: raw.tagline ?? "",
    description: raw.description ?? "",
    category: (raw.category_slug as Category) ?? "decoracion",
    universeSlug: (universeEntry?.slug as UniverseSlug) ?? undefined,
    priceFrom: raw.base_price ?? undefined,
    sizeRange: raw.size_range ?? "",
    material: raw.material ?? "",
    isHighRotation: raw.is_high_rotation,
    tags: raw.tags ?? [],
    image: raw.image_url ?? undefined,
    prefill: {
      description: prefill.description ?? "",
      category: prefill.category ?? "",
      size: prefill.size,
      material: prefill.material,
    },
    is_active: raw.is_active,
  };

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

  const boundAction = updateProduct.bind(null, id);

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
        <h1 className="text-xl font-bold text-primary">Editar producto</h1>
        <p className="text-sm text-muted">{product.name}</p>
      </div>
      <div className="rounded-2xl border border-white/8 bg-card p-6">
        <ProductForm action={boundAction} product={product} universes={universes} currentUniverseId={currentUniverseId} />
      </div>
    </div>
  );
}
