import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Universe } from "@/lib/catalog";

const ACCENT: Record<string, { border: string; bg: string; text: string }> = {
  indigo: {
    border: "border-starwars/20 hover:border-starwars/50",
    bg: "bg-starwars/5",
    text: "text-starwars",
  },
  emerald: {
    border: "border-potter/20 hover:border-potter/50",
    bg: "bg-potter/5",
    text: "text-potter",
  },
  purple: {
    border: "border-future/20 hover:border-future/50",
    bg: "bg-future/5",
    text: "text-future",
  },
  rose: {
    border: "border-anime/20 hover:border-anime/50",
    bg: "bg-anime/5",
    text: "text-anime",
  },
};

interface Props {
  universe: Universe;
  productCount: number;
}

export function UniverseCard({ universe, productCount }: Props) {
  const colors = ACCENT[universe.accentColor] ?? ACCENT.indigo;

  return (
    <Link
      href={`/universos/${universe.slug}`}
      className={cn(
        "flex flex-col rounded-2xl border-2 p-6 transition-all",
        colors.bg,
        colors.border
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="text-4xl">{universe.icon}</span>
        <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", colors.text, colors.border.split(" ")[0])}>
          {productCount} prod.
        </span>
      </div>

      <h3 className="text-lg font-bold text-primary">{universe.name}</h3>
      <p className={cn("mt-0.5 text-sm font-medium", colors.text)}>{universe.tagline}</p>
      <p className="mt-2 line-clamp-2 text-sm text-secondary">{universe.description}</p>

      <div className={cn("mt-4 flex items-center gap-1 text-sm font-semibold", colors.text)}>
        Explorar
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
