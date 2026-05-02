import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { UniverseForm } from "@/components/admin/UniverseForm";
import { updateUniverse } from "@/app/admin/universos/actions";

export const metadata: Metadata = { title: "Editar universo — Admin" };

export default async function EditarUniversoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: universe } = await supabase
    .from("universes")
    .select("id, slug, name, tagline, description, theme, accent_color, icon, preview_image, is_active")
    .eq("id", id)
    .single();

  if (!universe) notFound();

  const boundAction = updateUniverse.bind(null, id);

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <Link
          href="/admin/universos"
          className="mb-4 flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-secondary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Universos
        </Link>
        <h1 className="text-xl font-bold text-primary">Editar universo</h1>
        <p className="text-sm text-muted">{universe.icon} {universe.name}</p>
      </div>
      <div className="rounded-2xl border border-white/8 bg-card p-6">
        <UniverseForm action={boundAction} universe={universe} />
      </div>
    </div>
  );
}
