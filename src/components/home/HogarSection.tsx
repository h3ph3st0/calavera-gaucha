import Link from "next/link";
import { getProductsByCategory, formatPrice } from "@/lib/catalog";

const HOGAR_EMOJI: Record<string, string> = {
  "porta-control":        "📺",
  "ganchos-entrada":      "🪝",
  "dispensador-bolsas":   "🛍️",
  "organizador-bano":     "🚿",
  "soporte-tablet-cocina":"📱",
};

export function HogarSection() {
  const products = getProductsByCategory("hogar").slice(0, 4);

  return (
    <section className="bg-layer px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary">
              Hogar & Organización
            </span>
            <h2 className="mt-3 text-2xl font-bold text-primary sm:text-3xl">
              Funcional y a tu medida
            </h2>
            <p className="mt-2 text-secondary">
              Objetos de uso diario que hacen la diferencia en tu espacio.
            </p>
          </div>
          <Link
            href="/catalogo?categoria=hogar"
            className="hidden shrink-0 text-sm font-medium text-bronze transition-colors hover:text-cta sm:block"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/catalogo/${p.slug}`}
              className="group flex flex-col rounded-2xl border border-white/8 bg-card p-5 transition-all duration-200 hover:border-white/20 hover:shadow-lg hover:shadow-black/20"
            >
              <span className="mb-3 text-2xl">
                {HOGAR_EMOJI[p.slug] ?? "🏠"}
              </span>
              <p className="text-sm font-semibold leading-snug text-primary transition-colors group-hover:text-cta">
                {p.name}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-secondary">{p.tagline}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted">{p.material}</span>
                <span className="text-xs font-semibold text-bronze">{formatPrice(p.priceFrom)}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/catalogo?categoria=hogar"
            className="text-sm font-medium text-bronze transition-colors hover:text-cta"
          >
            Ver todos los productos de hogar →
          </Link>
        </div>
      </div>
    </section>
  );
}
