import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CATEGORY_LABELS, type Category } from "@/lib/catalog";
import {
  getProducts,
  getProductsByCategory,
} from "@/lib/supabase/catalog";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Llaveros, soportes, decoración y figuras temáticas. Impresión 3D bajo demanda en Argentina.",
};

const CATEGORY_ORDER: Category[] = ["llavero", "escritorio", "decoracion", "hogar"];

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const activeCategory = (Object.keys(CATEGORY_LABELS).find(
    (k) => k === categoria
  ) ?? null) as Category | null;

  const allProducts = activeCategory
    ? await getProductsByCategory(activeCategory)
    : await getProducts();

  const productosAMostrar = activeCategory
    ? allProducts
    : allProducts.filter((p) => p.category !== "universos");

  const universosProducts = activeCategory
    ? []
    : allProducts.filter((p) => p.category === "universos").slice(0, 3);

  return (
    <>
      <Header />
      <main className="flex-1 bg-base">
        <div className="border-b border-white/8 bg-layer px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold text-primary sm:text-3xl">Catálogo</h1>
            <p className="mt-2 text-secondary">
              Productos listos para pedir presupuesto. Personalizamos cualquier diseño.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/catalogo"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                !activeCategory
                  ? "bg-cta text-white shadow-sm shadow-cta/20"
                  : "border border-white/12 bg-card text-secondary hover:border-bronze/30 hover:text-primary"
              }`}
            >
              Todos
            </Link>
            {CATEGORY_ORDER.map((cat) => (
              <Link
                key={cat}
                href={`/catalogo?categoria=${cat}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  activeCategory === cat
                    ? "bg-cta text-white shadow-sm shadow-cta/20"
                    : "border border-white/12 bg-card text-secondary hover:border-bronze/30 hover:text-primary"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productosAMostrar.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

          {!activeCategory && universosProducts.length > 0 && (
            <div className="mt-16">
              <div className="mb-6 flex items-baseline justify-between">
                <div>
                  <h2 className="text-xl font-bold text-primary">Universos temáticos</h2>
                  <p className="mt-1 text-sm text-secondary">
                    Figuras y decoración inspiradas en mundos de fantasía, sci-fi, retro y más.
                  </p>
                </div>
                <Link
                  href="/universos"
                  className="shrink-0 text-sm font-medium text-bronze transition-colors hover:text-cta"
                >
                  Ver todos →
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {universosProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} compact />
                ))}
              </div>

              <div className="mt-4 text-center">
                <Link
                  href="/universos"
                  className="inline-block rounded-xl border border-white/12 bg-card px-6 py-2.5 text-sm font-medium text-secondary transition-colors hover:border-bronze/30 hover:text-primary"
                >
                  Explorar los 4 universos completos
                </Link>
              </div>
            </div>
          )}

          <div className="mt-16 rounded-2xl bg-cta px-6 py-10 text-center">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              ¿No encontrás lo que buscás?
            </h2>
            <p className="mt-2 text-white/70">
              Traé tu idea, archivo o referencia y lo hacemos a medida.
            </p>
            <Link
              href="/presupuesto"
              className="mt-6 inline-block rounded-xl bg-base px-8 py-3 text-sm font-bold text-primary transition-colors hover:bg-layer"
            >
              Pedir presupuesto personalizado
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
