"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const TENANT_SLUG = "calavera-gaucha";
const BUCKET = "work-images";
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

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

function sanitizeFilename(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "jpg";
  const base = name.substring(0, name.lastIndexOf(".")) || name;
  return base.toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, 40) + "." + ext;
}

async function uploadImages(workId: string, files: File[], startOrder = 0) {
  const supabase = createServiceClient();
  let order = startOrder;
  for (const file of files.slice(0, 6)) {
    if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE || file.size === 0) continue;
    const safeName = sanitizeFilename(file.name);
    const storagePath = `${workId}/${Date.now()}_${order}_${safeName}`;
    const buffer = await file.arrayBuffer();
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType: file.type, upsert: false });
    if (!error) {
      await supabase.from("work_images").insert({
        work_id: workId,
        storage_path: storagePath,
        original_name: file.name.slice(0, 200),
        display_order: order,
      });
      order++;
    }
  }
}

export async function createWork(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await assertAdmin();
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    if (!title) return { error: "El título es requerido" };

    const supabase = createServiceClient();
    const tenantId = await getTenantId();

    const { data: work, error } = await supabase
      .from("works")
      .insert({ tenant_id: tenantId, title, description })
      .select("id")
      .single();

    if (error || !work) return { error: "Error al crear el trabajo" };

    const files = formData.getAll("images") as File[];
    await uploadImages(work.id, files);
  } catch {
    return { error: "Error inesperado" };
  }

  revalidatePath("/admin/works");
  revalidatePath("/");
  redirect("/admin/works");
}

export async function updateWork(workId: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await assertAdmin();
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    const isPublished = formData.get("is_published") === "true";
    if (!title) return { error: "El título es requerido" };

    const supabase = createServiceClient();
    const { error } = await supabase
      .from("works")
      .update({ title, description, is_published: isPublished })
      .eq("id", workId);

    if (error) return { error: "Error al actualizar" };

    const files = (formData.getAll("images") as File[]).filter(f => f.size > 0);
    if (files.length > 0) {
      const { data: existing } = await supabase
        .from("work_images")
        .select("display_order")
        .eq("work_id", workId)
        .order("display_order", { ascending: false })
        .limit(1);
      const startOrder = (existing?.[0]?.display_order ?? -1) + 1;
      await uploadImages(workId, files, startOrder);
    }
  } catch {
    return { error: "Error inesperado" };
  }

  revalidatePath("/admin/works");
  revalidatePath("/");
  return { success: true };
}

export async function deleteWork(workId: string) {
  await assertAdmin();
  const supabase = createServiceClient();
  const { data: images } = await supabase
    .from("work_images")
    .select("storage_path")
    .eq("work_id", workId);
  if (images?.length) {
    await supabase.storage.from(BUCKET).remove(images.map(i => i.storage_path));
  }
  await supabase.from("works").delete().eq("id", workId);
  revalidatePath("/admin/works");
  revalidatePath("/");
}

export async function deleteWorkImage(imageId: string) {
  await assertAdmin();
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("work_images")
    .select("storage_path")
    .eq("id", imageId)
    .single();
  if (!data) throw new Error("Imagen no encontrada");
  await supabase.storage.from(BUCKET).remove([data.storage_path]);
  await supabase.from("work_images").delete().eq("id", imageId);
  revalidatePath("/admin/works");
  revalidatePath("/");
}
