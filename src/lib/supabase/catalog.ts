import { createServiceClient } from "@/lib/supabase/server";
import type { Product, Universe, Category, UniverseSlug } from "@/lib/catalog";

const TENANT_SLUG = "calavera-gaucha";

type PrefillJson = {
  description: string;
  category: string;
  size?: string;
  material?: string;
};

type ProductRow = {
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
  universe: { id: string; slug: string } | null;
};

type UniverseRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  theme: string | null;
  accent_color: string | null;
  icon: string | null;
  preview_image: string | null;
};

function toProduct(row: ProductRow): Product {
  const prefill = (row.prefill ?? {}) as PrefillJson;
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    category: (row.category_slug as Category) ?? "decoracion",
    universeSlug: (row.universe?.slug as UniverseSlug) ?? undefined,
    priceFrom: row.base_price ?? undefined,
    sizeRange: row.size_range ?? "",
    material: row.material ?? "",
    isHighRotation: row.is_high_rotation,
    tags: row.tags ?? [],
    image: row.image_url ?? undefined,
    prefill: {
      description: prefill.description ?? "",
      category: prefill.category ?? "",
      size: prefill.size,
      material: prefill.material,
    },
  };
}

function toUniverse(row: UniverseRow): Universe {
  return {
    slug: row.slug as UniverseSlug,
    name: row.name,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    theme: row.theme ?? "",
    accentColor: row.accent_color ?? "indigo",
    icon: row.icon ?? "🌟",
    previewImage: row.preview_image ?? undefined,
  };
}

async function getTenantId(): Promise<string> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("tenants")
    .select("id")
    .eq("slug", TENANT_SLUG)
    .single();
  if (!data) throw new Error("Tenant no encontrado");
  return data.id;
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createServiceClient();
  const tenantId = await getTenantId();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, tagline, description, category_slug, base_price, size_range, material, is_high_rotation, tags, image_url, prefill, universe:universes(id, slug)")
    .eq("tenant_id", tenantId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  return (data ?? []).map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = createServiceClient();
  const tenantId = await getTenantId();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, tagline, description, category_slug, base_price, size_range, material, is_high_rotation, tags, image_url, prefill, universe:universes(id, slug)")
    .eq("tenant_id", tenantId)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (!data) return undefined;
  return toProduct(data);
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  const supabase = createServiceClient();
  const tenantId = await getTenantId();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, tagline, description, category_slug, base_price, size_range, material, is_high_rotation, tags, image_url, prefill, universe:universes(id, slug)")
    .eq("tenant_id", tenantId)
    .eq("category_slug", category)
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  return (data ?? []).map(toProduct);
}

export async function getProductsByUniverse(universeSlug: UniverseSlug): Promise<Product[]> {
  const supabase = createServiceClient();
  const tenantId = await getTenantId();
  const { data: universe } = await supabase
    .from("universes")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("slug", universeSlug)
    .single();
  if (!universe) return [];
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, tagline, description, category_slug, base_price, size_range, material, is_high_rotation, tags, image_url, prefill, universe:universes(id, slug)")
    .eq("tenant_id", tenantId)
    .eq("universe_id", universe.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  return (data ?? []).map(toProduct);
}

export async function getHighRotationProducts(): Promise<Product[]> {
  const supabase = createServiceClient();
  const tenantId = await getTenantId();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, tagline, description, category_slug, base_price, size_range, material, is_high_rotation, tags, image_url, prefill, universe:universes(id, slug)")
    .eq("tenant_id", tenantId)
    .eq("is_high_rotation", true)
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  return (data ?? []).map(toProduct);
}

export async function getUniverses(): Promise<Universe[]> {
  const supabase = createServiceClient();
  const tenantId = await getTenantId();
  const { data } = await supabase
    .from("universes")
    .select("id, slug, name, tagline, description, theme, accent_color, icon, preview_image")
    .eq("tenant_id", tenantId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  return (data ?? []).map(toUniverse);
}

export async function getUniverseBySlug(slug: string): Promise<Universe | undefined> {
  const supabase = createServiceClient();
  const tenantId = await getTenantId();
  const { data } = await supabase
    .from("universes")
    .select("id, slug, name, tagline, description, theme, accent_color, icon, preview_image")
    .eq("tenant_id", tenantId)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (!data) return undefined;
  return toUniverse(data);
}

export async function getProductSlugs(): Promise<string[]> {
  const supabase = createServiceClient();
  const tenantId = await getTenantId();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("tenant_id", tenantId)
    .eq("is_active", true);
  return (data ?? []).map((r) => r.slug);
}

export async function getUniverseSlugs(): Promise<string[]> {
  const supabase = createServiceClient();
  const tenantId = await getTenantId();
  const { data } = await supabase
    .from("universes")
    .select("slug")
    .eq("tenant_id", tenantId)
    .eq("is_active", true);
  return (data ?? []).map((r) => r.slug);
}
