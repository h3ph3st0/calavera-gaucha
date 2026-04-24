import Link from "next/link";

const UNIVERSES = [
  {
    slug: "ciencia-ficcion",
    label: "Ciencia Ficción",
    icon: "🚀",
    style: "border-starwars/20 bg-starwars/5 hover:border-starwars/40",
    text: "text-starwars",
  },
  {
    slug: "fantasia-medieval",
    label: "Fantasía & Medieval",
    icon: "⚔️",
    style: "border-potter/20 bg-potter/5 hover:border-potter/40",
    text: "text-potter",
  },
  {
    slug: "retro",
    label: "Retro 80s/90s",
    icon: "📼",
    style: "border-future/20 bg-future/5 hover:border-future/40",
    text: "text-future",
  },
  {
    slug: "anime-manga",
    label: "Anime & Manga",
    icon: "⛩️",
    style: "border-anime/20 bg-anime/5 hover:border-anime/40",
    text: "text-anime",
  },
];

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
          {UNIVERSES.map((u) => (
            <Link
              key={u.slug}
              href={`/universos/${u.slug}`}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-all ${u.style}`}
            >
              <span className="text-3xl">{u.icon}</span>
              <span className={`text-sm font-semibold ${u.text}`}>{u.label}</span>
            </Link>
          ))}
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
