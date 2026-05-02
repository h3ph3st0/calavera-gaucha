"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { WORKS, type WorkCategory } from "@/lib/social-proof";

type FilterOption = WorkCategory | "all";

const FILTERS: { value: FilterOption; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "universos", label: "Universos" },
  { value: "llavero", label: "Llaveros" },
  { value: "personalizado", label: "Personalizados" },
  { value: "hogar", label: "Hogar" },
];

function Lightbox({ work, onClose }: { work: (typeof WORKS)[0]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className="relative flex max-h-[90vh] max-w-3xl w-full flex-col overflow-hidden rounded-2xl bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full" style={{ paddingBottom: "66%" }}>
          {work.image ? (
            <Image
              src={work.image}
              alt={work.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          ) : (
            <div className={cn("absolute inset-0 flex items-center justify-center bg-gradient-to-br", work.gradient)}>
              <span className="text-8xl">{work.emoji}</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <p className="text-base font-bold text-primary">{work.title}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-base px-3 py-1 text-xs font-medium text-secondary">
              {work.material}
            </span>
            <span className="rounded-full bg-base px-3 py-1 text-xs font-medium text-secondary">
              ⏱ {work.printTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkCard({ work, onClick }: { work: (typeof WORKS)[0]; onClick: () => void }) {
  return (
    <div
      className="group cursor-zoom-in overflow-hidden rounded-2xl border border-white/8 bg-card transition-all duration-200 hover:border-white/20 hover:shadow-lg hover:shadow-black/20"
      onClick={onClick}
    >
      <div className="relative h-48 w-full overflow-hidden">
        {work.image ? (
          <Image
            src={work.image}
            alt={work.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className={cn("flex h-full w-full items-center justify-center bg-gradient-to-br", work.gradient)}>
            <span className="text-5xl">{work.emoji}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold leading-tight text-primary">{work.title}</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-base px-2 py-0.5 text-[10px] font-medium text-muted">
            {work.material}
          </span>
          <span className="rounded-full bg-base px-2 py-0.5 text-[10px] font-medium text-muted">
            ⏱ {work.printTime}
          </span>
        </div>
      </div>
    </div>
  );
}

export function WorksGallery() {
  const [filter, setFilter] = useState<FilterOption>("all");
  const [selected, setSelected] = useState<(typeof WORKS)[0] | null>(null);

  const filtered = filter === "all" ? WORKS : WORKS.filter((w) => w.category === filter);
  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <>
      {selected && <Lightbox work={selected} onClose={handleClose} />}

      <section className="bg-layer px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-bronze/30 bg-bronze/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-bronze">
              Trabajos reales
            </span>
            <h2 className="mt-4 text-2xl font-bold text-primary sm:text-3xl">Lo que ya hicimos</h2>
            <p className="mt-3 text-secondary">
              Cada pieza es única. Hacé click en cualquier foto para verla en detalle.
            </p>
          </div>

          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  filter === f.value
                    ? "bg-cta text-white shadow-sm shadow-cta/20"
                    : "border border-white/12 bg-card text-secondary hover:border-bronze/30 hover:text-primary"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((work) => (
              <WorkCard key={work.id} work={work} onClick={() => setSelected(work)} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-8 text-center text-secondary">No hay trabajos en esta categoría aún.</p>
          )}
        </div>
      </section>
    </>
  );
}
