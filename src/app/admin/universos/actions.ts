"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionState = { error?: string; success?: boolean };

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
}

export async function updateUniverse(universeId: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await assertAdmin();

    const name = (formData.get("name") as string)?.trim();
    if (!name) return { error: "El nombre es requerido" };

    const supabase = createServiceClient();
    const { error } = await supabase.from("universes").update({
      name,
      tagline: (formData.get("tagline") as string)?.trim() || null,
      description: (formData.get("description") as string)?.trim() || null,
      theme: (formData.get("theme") as string)?.trim() || null,
      accent_color: (formData.get("accent_color") as string)?.trim() || null,
      icon: (formData.get("icon") as string)?.trim() || null,
      preview_image: (formData.get("preview_image") as string)?.trim() || null,
      is_active: formData.get("is_active") === "on",
    }).eq("id", universeId);

    if (error) return { error: error.message };
  } catch {
    return { error: "Error inesperado" };
  }

  revalidatePath("/admin/universos");
  revalidatePath("/universos");
  revalidatePath("/catalogo");
  return { success: true };
}
