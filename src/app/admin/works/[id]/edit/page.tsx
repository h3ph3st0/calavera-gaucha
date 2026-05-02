import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { WorkForm } from "@/components/admin/WorkForm";
import { updateWork, deleteWorkImage } from "../../actions";

export const metadata: Metadata = { title: "Editar trabajo — Admin" };

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditWorkPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: work } = await supabase
    .from("works")
    .select("id, title, description, is_published, work_images(id, storage_path, display_order)")
    .eq("id", id)
    .single();

  if (!work) notFound();

  const images = ((work.work_images as { id: string; storage_path: string; display_order: number }[]) ?? [])
    .sort((a, b) => a.display_order - b.display_order)
    .map(img => ({ ...img, supabaseUrl: SUPABASE_URL }));

  const updateAction = updateWork.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/works" className="mb-6 flex items-center gap-1 text-sm text-secondary hover:text-primary">
        <ChevronLeft className="h-4 w-4" />
        Volver a trabajos
      </Link>
      <h1 className="mb-6 text-xl font-bold text-primary">Editar trabajo</h1>
      <WorkForm
        action={updateAction}
        defaultValues={{
          title: work.title,
          description: work.description,
          is_published: work.is_published,
        }}
        existingImages={images}
        onDeleteImage={deleteWorkImage}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
