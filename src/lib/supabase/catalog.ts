import { createServiceClient } from "@/lib/supabase/server";
import type { Product, Universe, Category, UniverseSlug } from "@/lib/catalog";

const TENANT_SLUG = "calavera-gaucha";

const PRODUCT_SELECT =
  "id, slug, name, tagline, description, category_slug, base_price, size_range, material, is_high_rotation, tags, image_url, prefill, universe_id" as const;

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
  universe_id: string | null;
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

function toProduct(row: ProductRow, universeMap: Map<string, string>): Product {
  const prefill = (row.prefill ?? {}) as PrefillJson;
  const universeSlug = row.universe_id ? universeMap.get(row.universe_id) : undefined;
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    category: (row.category_slug as Category) ?? "decoracion",
    universeSlug: universeSlug as UniverseSlug | undefined,
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

async function getUniverseSlugMap(tenantId: string): Promise<Map<string, string>> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("universes")
    .select("id, slug")
    .eq("tenant_id", tenantId);
  return new Map((data ?? []).map((u) => [u.id, u.slug]));
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createServiceClient();
  const tenantId = await getTenantId();
  const [{ data }, universeMap] = await Promise.all([
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("tenant_id", tenantId)
      .eq("is_active", true)
      .order("created_at", { ascending: true }),
    getUniverseSlugMap(tenantId),
  ]);
  return (data ?? []).map((r) => toProduct(r as ProductRow, universeMap));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const supabase = createServiceClient();
  const tenantId = await getTenantId();
  const [{ data }, universeMap] = await Promise.all([
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("tenant_id", tenantId)
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle(),
    getUniverseSlugMap(tenantId),
  ]);
  if (!data) return undefined;
  return toProduct(data as ProductRow, universeMap);
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  const supabase = createServiceClient();
  const tenantId = await getTenantId();
  const [{ data }, universeMap] = await Promise.all([
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("tenant_id", tenantId)
      .eq("category_slug", category)
      .eq("is_active", true)
      .order("created_at", { ascending: true }),
    getUniverseSlugMap(tenantId),
  ]);
  return (data ?? []).map((r) => toProduct(r as ProductRow, universeMap));
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
    .select(PRODUCT_SELECT)
    .eq("tenant_id", tenantId)
    .eq("universe_id", universe.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  const universeMap = new Map([[universe.id, universeSlug as string]]);
  return (data ?? []).map((r) => toProduct(r as ProductRow, universeMap));
}

export async function getHighRotationProducts(): Promise<Product[]> {
  const supabase = createServiceClient();
  const tenantId = await getTenantId();
  const [{ data }, universeMap] = await Promise.all([
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("tenant_id", tenantId)
      .eq("is_high_rotation", true)
      .eq("is_active", true)
      .order("created_at", { ascending: true }),
    getUniverseSlugMap(tenantId),
  ]);
  return (data ?? []).map((r) => toProduct(r as ProductRow, universeMap));
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
  return (data ?? []).map((r) => toUniverse(r as UniverseRow));
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
    .maybeSingle();
  if (!data) return undefined;
  return toUniverse(data as UniverseRow);
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
