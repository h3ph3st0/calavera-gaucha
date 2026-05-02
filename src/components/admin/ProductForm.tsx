"use client";

import { useActionState } from "react";
import type { Product, Universe } from "@/lib/catalog";

const CATEGORIES = [
  { value: "llavero",    label: "Llaveros" },
  { value: "escritorio", label: "Escritorio" },
  { value: "decoracion", label: "Decoración" },
  { value: "hogar",      label: "Hogar & Organización" },
  { value: "universos",  label: "Universos" },
];

type ActionState = { error?: string; success?: boolean };
type Action = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

interface Props {
  action: Action;
  product?: Product & { id: string; is_active: boolean };
  universes: (Universe & { id: string })[];
  currentUniverseId?: string;
}

export function ProductForm({ action, product, universes, currentUniverseId }: Props) {
  const [state, formAction, isPending] = useActionState(action, {});

  const prefill = product?.prefill;
  const tagsValue = product?.tags?.join(", ") ?? "";

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
          Guardado correctamente.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Nombre */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Nombre *
          </label>
          <input
            name="name"
            defaultValue={product?.name ?? ""}
            required
            className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/40 focus:outline-none"
          />
        </div>

        {/* Tagline */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Tagline
          </label>
          <input
            name="tagline"
            defaultValue={product?.tagline ?? ""}
            className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/40 focus:outline-none"
            placeholder="1 línea, beneficio clave"
          />
        </div>

        {/* Descripción */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Descripción
          </label>
          <textarea
            name="description"
            defaultValue={product?.description ?? ""}
            rows={3}
            className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/40 focus:outline-none"
            placeholder="2-3 oraciones para la página de detalle"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Categoría
          </label>
          <select
            name="category_slug"
            defaultValue={product?.category ?? ""}
            className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary focus:border-bronze/40 focus:outline-none"
          >
            <option value="">— Seleccioná —</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Universo */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Universo (opcional)
          </label>
          <select
            name="universe_id"
            defaultValue={currentUniverseId ?? ""}
            className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary focus:border-bronze/40 focus:outline-none"
          >
            <option value="">— Ninguno —</option>
            {universes.map((u) => (
              <option key={u.id} value={u.id}>{u.icon} {u.name}</option>
            ))}
          </select>
        </div>

        {/* Precio */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Precio desde (ARS)
          </label>
          <input
            name="base_price"
            type="number"
            defaultValue={product?.priceFrom ?? ""}
            min={0}
            className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/40 focus:outline-none"
            placeholder="Dejar vacío = A consultar"
          />
        </div>

        {/* Rango de tamaño */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Rango de tamaño
          </label>
          <input
            name="size_range"
            defaultValue={product?.sizeRange ?? ""}
            className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/40 focus:outline-none"
            placeholder="ej: 4 – 8 cm"
          />
        </div>

        {/* Material */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Material
          </label>
          <input
            name="material"
            defaultValue={product?.material ?? ""}
            className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/40 focus:outline-none"
            placeholder="ej: PLA, PETG, Flexible"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Tags (separados por coma)
          </label>
          <input
            name="tags"
            defaultValue={tagsValue}
            className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/40 focus:outline-none"
            placeholder="regalo, personalizado, decoracion"
          />
        </div>

        {/* URL de imagen */}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            URL de imagen
          </label>
          <input
            name="image_url"
            defaultValue={product?.image ?? ""}
            className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary placeholder:text-muted focus:border-bronze/40 focus:outline-none"
            placeholder="/works/foto.jpg  o  https://..."
          />
        </div>

        {/* Checkboxes */}
        <div className="flex items-center gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-secondary">
            <input
              type="checkbox"
              name="is_high_rotation"
              defaultChecked={product?.isHighRotation ?? false}
              className="h-4 w-4 accent-cta"
            />
            Alta rotación
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-secondary">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={product?.is_active ?? true}
              className="h-4 w-4 accent-cta"
            />
            Activo (visible en catálogo)
          </label>
        </div>
      </div>

      {/* Prefill del formulario de presupuesto */}
      <div className="rounded-2xl border border-white/8 bg-layer p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Prefill del formulario de presupuesto
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-muted">Descripción</label>
            <textarea
              name="prefill_description"
              defaultValue={prefill?.description ?? ""}
              rows={2}
              className="w-full rounded-xl border border-white/12 bg-card px-3 py-2 text-sm text-primary placeholder:text-muted focus:border-bronze/40 focus:outline-none"
              placeholder="Texto que se carga automáticamente en el campo descripción"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Categoría del form</label>
            <input
              name="prefill_category"
              defaultValue={prefill?.category ?? ""}
              className="w-full rounded-xl border border-white/12 bg-card px-3 py-2 text-sm text-primary placeholder:text-muted focus:border-bronze/40 focus:outline-none"
              placeholder="ej: llavero, figura, decoracion"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Tamaño sugerido</label>
            <input
              name="prefill_size"
              defaultValue={prefill?.size ?? ""}
              className="w-full rounded-xl border border-white/12 bg-card px-3 py-2 text-sm text-primary placeholder:text-muted focus:border-bronze/40 focus:outline-none"
              placeholder="pequeño / mediano / grande"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Material sugerido</label>
            <input
              name="prefill_material"
              defaultValue={prefill?.material ?? ""}
              className="w-full rounded-xl border border-white/12 bg-card px-3 py-2 text-sm text-primary placeholder:text-muted focus:border-bronze/40 focus:outline-none"
              placeholder="pla / petg / flexible"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-cta py-3 text-sm font-semibold text-white shadow-lg shadow-cta/20 transition-colors hover:bg-cta-dark disabled:opacity-50"
      >
        {isPending ? "Guardando…" : "Guardar producto"}
      </button>
    </form>
  );
}
