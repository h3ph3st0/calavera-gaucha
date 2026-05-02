import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/catalog/ProductCard";
import { UNIVERSES, getUniverseBySlug, getProductsByUniverse } from "@/lib/catalog";
import { getWorksByUniverse } from "@/lib/social-proof";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return UNIVERSES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const universe = getUniverseBySlug(slug);
  if (!universe) return {};
  return {
    title: universe.name,
    description: universe.description,
  };
}

const ACCENT_STYLES: Record<string, { glow: string; badge: string; btn: string; text: string }> = {
  indigo: {
    glow: "from-starwars/12 via-transparent to-transparent",
    badge: "bg-starwars/15 border-starwars/30 text-starwars",
    btn: "bg-starwars text-black hover:bg-starwars/80",
    text: "text-starwars",
  },
  emerald: {
    glow: "from-potter/12 via-transparent to-transparent",
    badge: "bg-potter/15 border-potter/30 text-potter",
    btn: "bg-potter text-white hover:bg-potter/80",
    text: "text-potter",
  },
  purple: {
    glow: "from-future/12 via-transparent to-transparent",
    badge: "bg-future/15 border-future/30 text-future",
    btn: "bg-future text-white hover:bg-future/80",
    text: "text-future",
  },
  rose: {
    glow: "from-anime/12 via-transparent to-transparent",
    badge: "bg-anime/15 border-anime/30 text-anime",
    btn: "bg-anime text-white hover:bg-anime/80",
    text: "text-anime",
  },
};

export default async function UniversePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const universe = getUniverseBySlug(slug);
  if (!universe) notFound();

  const products = getProductsByUniverse(universe.slug);
  const works = getWorksByUniverse(universe.slug);
  const styles = ACCENT_STYLES[universe.accentColor] ?? ACCENT_STYLES.indigo;

  const customQuoteUrl =
    `/presupuesto?desc=${encodeURIComponent(
      `Quiero un diseño personalizado del universo ${universe.name}. Comparto referencias por WhatsApp.`
    )}&categoria=figura`;

  return (
    <>
      <Header />
      <main className="flex-1 bg-base">
        {/* Banner */}
        <div className={cn("bg-gradient-to-b px-4 py-14 sm:px-6", styles.glow)}>
          <div className="mx-auto max-w-6xl">
            <Link
              href="/universos"
              className="mb-4 flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-secondary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Universos
            </Link>

            <div className="flex items-start gap-5">
              <span className="text-6xl">{universe.icon}</span>
              <div>
                <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", styles.badge)}>
                  {products.length} productos disponibles
                </span>
                <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">{universe.name}</h1>
                <p className="mt-2 max-w-xl text-secondary">{universe.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          {products.length > 0 ? (
            <>
              <h2 className="mb-6 text-lg font-bold text-primary">
                Productos de {universe.name}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </>
          ) : (
            <p className="py-10 text-center text-secondary">
              Productos de este universo próximamente.
            </p>
          )}

          {works.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-lg font-bold text-primary">
                Trabajos realizados — {universe.name}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {works.map((work) => (
                  <div
                    key={work.id}
                    className="overflow-hidden rounded-2xl border border-white/8 bg-card"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      {work.image ? (
                        <Image
                          src={work.image}
                          alt={work.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex h-full w-full items-center justify-center bg-gradient-to-br",
                            work.gradient
                          )}
                        >
                          <span className="text-5xl">{work.emoji}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-primary">{work.title}</p>
                      <p className="mt-1 text-xs text-muted">
                        {work.material} · {work.printTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-white/8 bg-card px-6 py-10 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <h3 className="font-bold text-primary">
                ¿Querés algo específico de {universe.name}?
              </h3>
              <p className="mt-1 text-sm text-secondary">
                Contanos tu idea o compartí una imagen de referencia. Lo diseñamos a medida, sin usar marcas registradas.
              </p>
            </div>
            <Link
              href={customQuoteUrl}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors",
                styles.btn
              )}
            >
              Pedir diseño personalizado
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              Otros universos
            </h3>
            <div className="flex flex-wrap gap-3">
              {UNIVERSES.filter((u) => u.slug !== universe.slug).map((u) => (
                <Link
                  key={u.slug}
                  href={`/universos/${u.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-white/12 bg-card px-4 py-2.5 text-sm font-medium text-secondary transition-colors hover:border-bronze/30 hover:text-primary"
                >
                  {u.icon} {u.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
