import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WorkGalleryClient } from "@/components/works/WorkGalleryWrapper";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data } = await supabase.from("works").select("title, description").eq("id", id).single();
  return {
    title: data ? `${data.title} — Calavera Gaucha` : "Trabajo — Calavera Gaucha",
    description: data?.description ?? undefined,
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: work } = await supabase
    .from("works")
    .select("id, title, description, is_published")
    .eq("id", id)
    .single();

  if (!work || !work.is_published) notFound();

  const { data: images } = await supabase
    .from("work_images")
    .select("id, storage_path, display_order")
    .eq("work_id", id)
    .order("display_order", { ascending: true });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-base px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/#trabajos"
            className="mb-8 flex items-center gap-1 text-sm text-secondary hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <h1 className="text-2xl font-bold text-primary sm:text-3xl">{work.title}</h1>
          {work.description && (
            <p className="mt-3 text-secondary">{work.description}</p>
          )}

          {images && images.length > 0 && (
            <WorkGalleryClient images={images} title={work.title} supabaseUrl={SUPABASE_URL} />
          )}

          <div className="mt-12 rounded-2xl border border-white/8 bg-card p-6 text-center">
            <h2 className="text-lg font-bold text-primary">¿Querés algo similar?</h2>
            <p className="mt-2 text-sm text-secondary">
              Contanos tu idea y te mandamos el presupuesto por WhatsApp en menos de 24 horas.
            </p>
            <Link
              href="/presupuesto"
              className="mt-6 inline-block rounded-xl bg-cta px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cta/20 transition-colors hover:bg-cta-dark"
            >
              Solicitar presupuesto gratis
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
