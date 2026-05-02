import Link from "next/link";
import Image from "next/image";
import { UNIVERSES } from "@/lib/catalog";

const ACCENT_STYLE: Record<string, { border: string; text: string }> = {
  indigo:  { border: "border-starwars/20 hover:border-starwars/50", text: "text-starwars" },
  emerald: { border: "border-potter/20 hover:border-potter/50",    text: "text-potter"  },
  purple:  { border: "border-future/20 hover:border-future/50",    text: "text-future"  },
  rose:    { border: "border-anime/20 hover:border-anime/50",      text: "text-anime"   },
};

export function UniversesCTA() {
  return (
    <section className="bg-base px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-bold text-primary sm:text-3xl">
          Explorá los universos
        </h2>
        <p className="mt-3 text-center text-secondary">
          Colecciones temáticas para cada pasión
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {UNIVERSES.map((u) => {
            const style = ACCENT_STYLE[u.accentColor] ?? ACCENT_STYLE.indigo;
            return (
              <Link
                key={u.slug}
                href={`/universos/${u.slug}`}
                className={`group relative flex h-44 flex-col justify-end overflow-hidden rounded-2xl border-2 transition-all ${style.border}`}
              >
                {u.previewImage ? (
                  <>
                    <Image
                      src={u.previewImage}
                      alt={u.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    {u.icon}
                  </div>
                )}
                <div className="relative p-4">
                  <p className="text-xs font-bold text-white/60">{u.icon}</p>
                  <p className={`mt-0.5 text-sm font-bold ${style.text}`}>{u.name}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/universos"
            className="text-sm font-medium text-bronze underline underline-offset-4 transition-colors hover:text-cta"
          >
            Ver todos los universos →
          </Link>
        </div>
      </div>
    </section>
  );
}
