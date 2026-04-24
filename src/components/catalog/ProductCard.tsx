import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Product, formatPrice } from "@/lib/catalog";

const CATEGORY_GRADIENT: Record<string, string> = {
  llavero:    "from-bronze/15 to-bronze/5",
  escritorio: "from-anime/10 to-anime/3",
  decoracion: "from-success/10 to-success/3",
  universos:  "from-potter/10 to-potter/3",
};

const UNIVERSE_GRADIENT: Record<string, string> = {
  "ciencia-ficcion":   "from-starwars/15 to-starwars/3",
  "fantasia-medieval": "from-potter/15 to-potter/3",
  retro:               "from-future/15 to-future/3",
  "anime-manga":       "from-anime/15 to-anime/3",
};

const CATEGORY_ICON: Record<string, string> = {
  llavero:    "🔑",
  escritorio: "🖥️",
  decoracion: "🏺",
  universos:  "✨",
};

interface Props {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: Props) {
  const gradient = product.universeSlug
    ? UNIVERSE_GRADIENT[product.universeSlug]
    : CATEGORY_GRADIENT[product.category];

  const quoteUrl = `/presupuesto?desc=${encodeURIComponent(product.prefill.description)}&categoria=${product.prefill.category}${product.prefill.size ? `&tam=${product.prefill.size}` : ""}${product.prefill.material ? `&mat=${product.prefill.material}` : ""}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-card transition-all hover:border-bronze/30 hover:shadow-lg hover:shadow-black/30">
      <div className={cn("flex h-40 items-center justify-center bg-gradient-to-br text-5xl", gradient)}>
        {CATEGORY_ICON[product.category]}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          {product.isHighRotation && (
            <span className="mb-2 inline-block rounded-full bg-cta/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cta">
              Alta rotación
            </span>
          )}
          <h3 className="font-semibold text-primary">{product.name}</h3>
          <p className="mt-1 text-sm text-secondary line-clamp-2">{product.tagline}</p>

          {!compact && (
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
              <span>📐 {product.sizeRange}</span>
              <span>🎨 {product.material}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-bronze">
            {formatPrice(product.priceFrom)}
          </span>

          <div className="flex items-center gap-2">
            <Link
              href={`/catalogo/${product.slug}`}
              className="rounded-lg border border-white/12 px-3 py-1.5 text-xs font-medium text-secondary transition-colors hover:border-white/25 hover:text-primary"
            >
              Ver más
            </Link>
            <Link
              href={quoteUrl}
              className="flex items-center gap-1 rounded-lg bg-cta px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-cta-dark"
            >
              Pedir
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
