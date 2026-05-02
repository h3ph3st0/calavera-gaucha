"use client";

import { useActionState } from "react";

const ACCENT_OPTIONS = [
  { value: "indigo",  label: "Indigo (Ciencia Ficción)" },
  { value: "emerald", label: "Esmeralda (Fantasía)" },
  { value: "purple",  label: "Púrpura (Retro)" },
  { value: "rose",    label: "Rosa (Anime)" },
];

type ActionState = { error?: string; success?: boolean };
type Action = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

interface UniverseData {
  name: string;
  tagline: string | null;
  description: string | null;
  theme: string | null;
  accent_color: string | null;
  icon: string | null;
  preview_image: string | null;
  is_active: boolean;
}

interface Props {
  action: Action;
  universe: UniverseData;
}

export function UniverseForm({ action, universe }: Props) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
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

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Nombre *</label>
        <input
          name="name"
          defaultValue={universe.name}
          required
          className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary focus:border-bronze/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Tagline</label>
        <input
          name="tagline"
          defaultValue={universe.tagline ?? ""}
          className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary focus:border-bronze/40 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Descripción</label>
        <textarea
          name="description"
          defaultValue={universe.description ?? ""}
          rows={3}
          className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary focus:border-bronze/40 focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Ícono (emoji)</label>
          <input
            name="icon"
            defaultValue={universe.icon ?? ""}
            className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary focus:border-bronze/40 focus:outline-none"
            placeholder="🚀"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Color de acento</label>
          <select
            name="accent_color"
            defaultValue={universe.accent_color ?? "indigo"}
            className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary focus:border-bronze/40 focus:outline-none"
          >
            {ACCENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Theme (interno)</label>
          <input
            name="theme"
            defaultValue={universe.theme ?? ""}
            className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary focus:border-bronze/40 focus:outline-none"
            placeholder="sci-fi / fantasy / retro / anime"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Imagen preview</label>
          <input
            name="preview_image"
            defaultValue={universe.preview_image ?? ""}
            className="w-full rounded-xl border border-white/12 bg-layer px-3 py-2.5 text-sm text-primary focus:border-bronze/40 focus:outline-none"
            placeholder="/works/foto.jpg"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-secondary">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={universe.is_active}
          className="h-4 w-4 accent-cta"
        />
        Activo (visible en el sitio)
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-cta py-3 text-sm font-semibold text-white shadow-lg shadow-cta/20 transition-colors hover:bg-cta-dark disabled:opacity-50"
      >
        {isPending ? "Guardando…" : "Guardar universo"}
      </button>
    </form>
  );
}
