import { createServiceClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export async function LatestWorksSection() {
  const supabase = createServiceClient();
  const { data: works } = await supabase
    .from("works")
    .select("id, title, description, work_images(storage_path, display_order)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (!works?.length) return null;

  return (
    <section className="bg-layer px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">Últimos trabajos</h2>
          <p className="mt-3 text-secondary">Lo que estamos haciendo ahora mismo</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map(work => {
            const images = ((work.work_images as { storage_path: string; display_order: number }[]) ?? [])
              .sort((a, b) => a.display_order - b.display_order);
            const cover = images[0];
            return (
              <div key={work.id} className="overflow-hidden rounded-2xl border border-white/8 bg-card">
                {cover ? (
                  <div className="relative h-52 w-full">
                    <Image
                      src={`${SUPABASE_URL}/storage/v1/object/public/work-images/${cover.storage_path}`}
                      alt={work.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-52 bg-layer" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-primary">{work.title}</h3>
                  {work.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-secondary">{work.description}</p>
                  )}
                  <p className="mt-2 text-xs text-muted">
                    {images.length} foto{images.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/presupuesto"
            className="inline-block rounded-xl bg-cta px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-cta/20 transition-colors hover:bg-cta-dark"
          >
            ¿Te gusta lo que ves? Pedí tu presupuesto
          </Link>
        </div>
      </div>
    </section>
  );
}
