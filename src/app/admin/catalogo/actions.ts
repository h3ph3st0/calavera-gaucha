"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const TENANT_SLUG = "calavera-gaucha";

type ActionState = { error?: string; success?: boolean };

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
}

async function getTenantId() {
  const supabase = createServiceClient();
  const { data } = await supabase.from("tenants").select("id").eq("slug", TENANT_SLUG).single();
  if (!data) throw new Error("Tenant no encontrado");
  return data.id;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parsePrefill(formData: FormData) {
  return {
    description: (formData.get("prefill_description") as string)?.trim() ?? "",
    category: (formData.get("prefill_category") as string)?.trim() ?? "",
    size: (formData.get("prefill_size") as string)?.trim() || undefined,
    material: (formData.get("prefill_material") as string)?.trim() || undefined,
  };
}

export async function createProduct(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await assertAdmin();

    const name = (formData.get("name") as string)?.trim();
    if (!name) return { error: "El nombre es requerido" };

    const slug = slugify(name);
    const supabase = createServiceClient();
    const tenantId = await getTenantId();

    const universeIdRaw = (formData.get("universe_id") as string)?.trim() || null;
    const basePriceRaw = formData.get("base_price") as string;
    const tagsRaw = (formData.get("tags") as string)?.trim();

    const { error } = await supabase.from("products").insert({
      tenant_id: tenantId,
      slug,
      name,
      tagline: (formData.get("tagline") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      category_slug: (formData.get("category_slug") as string) || null,
      universe_id: universeIdRaw || null,
      base_price: basePriceRaw ? Number(basePriceRaw) : null,
      size_range: (formData.get("size_range") as string)?.trim() || null,
      material: (formData.get("material") as string)?.trim() || null,
      is_high_rotation: formData.get("is_high_rotation") === "on",
      tags: tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [],
      image_url: (formData.get("image_url") as string)?.trim() || null,
      prefill: parsePrefill(formData),
      is_active: formData.get("is_active") === "on",
    });

    if (error) return { error: error.message };
  } catch {
    return { error: "Error inesperado" };
  }

  revalidatePath("/admin/catalogo");
  revalidatePath("/catalogo");
  revalidatePath("/universos");
  redirect("/admin/catalogo");
}

export async function updateProduct(productId: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await assertAdmin();

    const name = (formData.get("name") as string)?.trim();
    if (!name) return { error: "El nombre es requerido" };

    const supabase = createServiceClient();
    const universeIdRaw = (formData.get("universe_id") as string)?.trim() || null;
    const basePriceRaw = formData.get("base_price") as string;
    const tagsRaw = (formData.get("tags") as string)?.trim();

    const { error } = await supabase.from("products").update({
      name,
      tagline: (formData.get("tagline") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      category_slug: (formData.get("category_slug") as string) || null,
      universe_id: universeIdRaw || null,
      base_price: basePriceRaw ? Number(basePriceRaw) : null,
      size_range: (formData.get("size_range") as string)?.trim() || null,
      material: (formData.get("material") as string)?.trim() || null,
      is_high_rotation: formData.get("is_high_rotation") === "on",
      tags: tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [],
      image_url: (formData.get("image_url") as string)?.trim() || null,
      prefill: parsePrefill(formData),
      is_active: formData.get("is_active") === "on",
    }).eq("id", productId);

    if (error) return { error: error.message };
  } catch {
    return { error: "Error inesperado" };
  }

  revalidatePath("/admin/catalogo");
  revalidatePath("/catalogo");
  revalidatePath("/universos");
  return { success: true };
}

export async function deleteProduct(productId: string) {
  await assertAdmin();
  const supabase = createServiceClient();
  await supabase.from("products").delete().eq("id", productId);
  revalidatePath("/admin/catalogo");
  revalidatePath("/catalogo");
  revalidatePath("/universos");
}
