import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { DeleteWorkButton } from "@/components/admin/DeleteWorkButton";

export const metadata: Metadata = { title: "Trabajos — Admin" };
export const dynamic = "force-dynamic";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export default async function WorksPage() {
  const supabase = createServiceClient();
  const { data: works } = await supabase
    .from("works")
    .select("id, title, is_published, created_at")
    .order("created_at", { ascending: false });

  const { data: allImages } = await supabase
    .from("work_images")
    .select("id, work_id, storage_path, display_order")
    .in("work_id", works?.map(w => w.id) ?? [])
    .order("display_order", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Trabajos</h1>
          <p className="text-sm text-secondary">{works?.length ?? 0} en total</p>
        </div>
        <Link
          href="/admin/works/new"
          className="flex items-center gap-1.5 rounded-xl bg-cta px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cta/20 transition-colors hover:bg-cta-dark"
        >
          <Plus className="h-4 w-4" />
          Nuevo trabajo
        </Link>
      </div>

      {!works?.length ? (
        <div className="rounded-2xl border border-white/8 bg-card py-16 text-center">
          <p className="text-secondary">No hay trabajos aún.</p>
          <Link href="/admin/works/new" className="mt-4 inline-block text-sm text-bronze hover:text-cta">
            Subí el primero →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {works.map(work => {
            const images = (allImages ?? [])
              .filter(img => img.work_id === work.id);
            const cover = images[0];
            return (
              <div key={work.id} className="flex items-center gap-4 rounded-2xl border border-white/8 bg-card p-4">
                {cover ? (
                  <Image
                    src={`${SUPABASE_URL}/storage/v1/object/public/work-images/${cover.storage_path}`}
                    alt={work.title}
                    width={64}
                    height={64}
                    className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-layer">
                    <span className="text-xs text-muted">sin foto</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-primary">{work.title}</p>
                    {!work.is_published && (
                      <span className="rounded-full bg-layer px-2 py-0.5 text-xs text-muted">borrador</span>
                    )}
                  </div>
                  <p className="text-sm text-muted">{images.length} foto{images.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/works/${work.id}/edit`}
                    className="rounded-lg p-2 text-secondary transition-colors hover:bg-layer hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <DeleteWorkButton workId={work.id} title={work.title} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
