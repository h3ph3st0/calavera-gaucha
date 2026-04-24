import Link from "next/link";
import { cn } from "@/lib/utils";
import { INSPIRATIONS } from "@/lib/social-proof";

function InspirationCard({ item }: { item: (typeof INSPIRATIONS)[0] }) {
  const url = `/presupuesto?desc=${encodeURIComponent(item.prefillDescription)}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-card transition-all duration-200 hover:border-bronze/25 hover:shadow-lg hover:shadow-black/20">
      <div className={cn("flex h-28 items-center justify-center bg-gradient-to-b", item.gradient)}>
        <span className="text-4xl">{item.emoji}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-semibold text-primary">{item.title}</p>
        <p className="mt-1.5 flex-1 text-sm text-secondary">{item.description}</p>
        <Link
          href={url}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-bronze transition-colors hover:text-cta"
        >
          Quiero algo así →
        </Link>
      </div>
    </div>
  );
}

export function InspirationGrid() {
  return (
    <section className="bg-base px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cta/30 bg-cta/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cta">
            Ideas para imprimir
          </span>
          <h2 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">
            ¿Qué podés encargar?
          </h2>
          <p className="mt-3 text-secondary">
            Si algo de esto te resuena, un click y el formulario aparece pre-llenado.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INSPIRATIONS.map((item) => (
            <InspirationCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
