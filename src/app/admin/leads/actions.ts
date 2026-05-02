"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { QuoteStatus } from "@/lib/supabase/types";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  return user;
}

export async function updateLeadStatus(leadId: string, status: QuoteStatus) {
  await assertAdmin();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("quotes")
    .update({ status })
    .eq("id", leadId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
}

export async function updateLeadNotes(leadId: string, notes: string) {
  await assertAdmin();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("quotes")
    .update({ admin_notes: notes })
    .eq("id", leadId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
}
