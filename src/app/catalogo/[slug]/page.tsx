import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Package, Ruler, Layers } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/catalog/ProductCard";
import {
  PRODUCTS,
  UNIVERSES,
  getProductBySlug,
  getProductsByUniverse,
  getProductsByCategory,
  formatPrice,
  CATEGORY_LABELS,
} from "@/lib/catalog";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.tagline,
  };
}

const GRADIENT: Record<string, string> = {
  llavero:             "from-bronze/15 to-bronze/5",
  escritorio:          "from-anime/10 to-anime/3",
  decoracion:          "from-success/10 to-success/3",
  universos:           "from-potter/10 to-potter/3",
  "ciencia-ficcion":   "from-starwars/15 to-starwars/3",
  "fantasia-medieval": "from-potter/15 to-potter/3",
  retro:               "from-future/15 to-future/3",
  "anime-manga":       "from-anime/15 to-anime/3",
};

const ICON: Record<string, string> = {
  llavero: "🔑", escritorio: "🖥️", decoracion: "🏺", universos: "✨",
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const gradient = product.universeSlug
    ? GRADIENT[product.universeSlug]
    : GRADIENT[product.category];

  const universe = product.universeSlug
    ? UNIVERSES.find((u) => u.slug === product.universeSlug)
    : null;

  const related = (
    product.universeSlug
      ? getProductsByUniverse(product.universeSlug)
      : getProductsByCategory(product.category)
  )
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const quoteUrl =
    `/presupuesto?desc=${encodeURIComponent(product.prefill.description)}` +
    `&categoria=${product.prefill.category}` +
    (product.prefill.size ? `&tam=${product.prefill.size}` : "") +
    (product.prefill.material ? `&mat=${product.prefill.material}` : "");

  return (
    <>
      <Header />
      <main className="flex-1 bg-base">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
            <Link href="/catalogo" className="flex items-center gap-1 transition-colors hover:text-secondary">
              <ArrowLeft className="h-3.5 w-3.5" />
              Catálogo
            </Link>
            {universe && (
              <>
                <span>/</span>
                <Link href={`/universos/${universe.slug}`} className="transition-colors hover:text-secondary">
                  {universe.name}
                </Link>
              </>
            )}
            {!universe && (
              <>
                <span>/</span>
                <Link href={`/catalogo?categoria=${product.category}`} className="transition-colors hover:text-secondary">
                  {CATEGORY_LABELS[product.category]}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-secondary">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className={`flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br text-8xl lg:h-80 ${gradient}`}>
              {ICON[product.category]}
            </div>

            <div className="flex flex-col">
              {universe && (
                <Link
                  href={`/universos/${universe.slug}`}
                  className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/12 bg-card px-3 py-1 text-xs font-semibold text-secondary transition-colors hover:border-bronze/30 hover:text-primary"
                >
                  {universe.icon} {universe.name}
                </Link>
              )}

              <h1 className="text-2xl font-bold text-primary sm:text-3xl">{product.name}</h1>
              <p className="mt-2 text-base font-medium text-secondary">{product.tagline}</p>
              <p className="mt-4 leading-relaxed text-secondary">{product.description}</p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: Ruler, label: "Tamaño", value: product.sizeRange },
                  { icon: Layers, label: "Material", value: product.material },
                  { icon: Package, label: "Categoría", value: CATEGORY_LABELS[product.category] },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl border border-white/8 bg-card p-3 text-center">
                    <Icon className="mx-auto mb-1 h-4 w-4 text-muted" />
                    <p className="text-[10px] uppercase tracking-wide text-muted">{label}</p>
                    <p className="mt-0.5 text-xs font-semibold text-primary">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-xs text-muted">Precio estimado</p>
                <p className="text-xl font-bold text-bronze">{formatPrice(product.priceFrom)}</p>
                <p className="text-xs text-muted">+ envío · varía según personalización</p>
              </div>

              <Link
                href={quoteUrl}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-cta py-4 text-base font-semibold text-white shadow-lg shadow-cta/20 transition-colors hover:bg-cta-dark"
              >
                Pedir presupuesto para este producto
                <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="mt-2 text-center text-xs text-muted">
                El formulario se completa automáticamente con los datos de este producto
              </p>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-lg font-bold text-primary">También te puede interesar</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <ProductCard key={p.slug} product={p} compact />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
