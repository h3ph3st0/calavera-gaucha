import { createServiceClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export async function LatestWorksSection() {
  const supabase = createServiceClient();
  const { data: works } = await supabase
    .from("works")
    .select("id, title, description")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (!works?.length) return null;

  const { data: allImages } = await supabase
    .from("work_images")
    .select("work_id, storage_path, display_order")
    .in("work_id", works.map(w => w.id))
    .order("display_order", { ascending: true });

  return (
    <section className="bg-layer px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">Últimos trabajos</h2>
          <p className="mt-3 text-secondary">Lo que estamos haciendo ahora mismo</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map(work => {
            const images = (allImages ?? []).filter(img => img.work_id === work.id);
            const cover = images[0];
            return (
              <Link
                key={work.id}
                href={`/trabajos/${work.id}`}
                className="group overflow-hidden rounded-2xl border border-white/8 bg-card transition-colors hover:border-bronze/30"
              >
                {cover ? (
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={`${SUPABASE_URL}/storage/v1/object/public/work-images/${cover.storage_path}`}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                  </div>
                ) : (
                  <div className="h-52 bg-layer" />
                )}
                <div className="flex items-start justify-between p-4">
                  <div>
                    <h3 className="font-semibold text-primary">{work.title}</h3>
                    {work.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-secondary">{work.description}</p>
                    )}
                  </div>
                  <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted transition-colors group-hover:text-bronze" />
                </div>
              </Link>
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
