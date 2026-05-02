"use client";

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ImagePlus, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";

type ActionState = { error?: string; success?: boolean };
type ExistingImage = { id: string; storage_path: string; supabaseUrl: string };

interface Props {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: { title: string; description: string | null; is_published: boolean };
  existingImages?: ExistingImage[];
  onDeleteImage?: (imageId: string, storagePath: string) => Promise<void>;
  submitLabel: string;
}

export function WorkForm({ action, defaultValues, existingImages = [], onDeleteImage, submitLabel }: Props) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [previews, setPreviews] = useState<{ url: string; name: string }[]>([]);
  const [isPublished, setIsPublished] = useState(defaultValues?.is_published ?? true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map(f => ({ url: URL.createObjectURL(f), name: f.name })));
  }

  async function handleDeleteImage(imageId: string, storagePath: string) {
    if (!onDeleteImage) return;
    setDeletingId(imageId);
    await onDeleteImage(imageId, storagePath);
    router.refresh();
    setDeletingId(null);
  }

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state?.error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          Cambios guardados correctamente
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-secondary">Título *</label>
        <input
          name="title"
          defaultValue={defaultValues?.title}
          required
          maxLength={100}
          placeholder="Ej: Mate lavarropas personalizado"
          className="w-full rounded-xl border border-white/12 bg-card px-4 py-2.5 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-cta/50"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-secondary">Descripción</label>
        <textarea
          name="description"
          defaultValue={defaultValues?.description ?? ""}
          rows={3}
          maxLength={500}
          placeholder="Contá brevemente el trabajo: quién lo encargó, para qué, qué tiene de especial..."
          className="w-full resize-none rounded-xl border border-white/12 bg-card px-4 py-2.5 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-cta/50"
        />
      </div>

      {defaultValues !== undefined && (
        <div className="flex items-center gap-3">
          <input type="hidden" name="is_published" value={isPublished ? "true" : "false"} />
          <label className="flex cursor-pointer select-none items-center gap-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={e => setIsPublished(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-card accent-orange-500"
            />
            <span className="text-sm text-secondary">Publicado (visible en el sitio)</span>
          </label>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-secondary">
          {existingImages.length > 0 ? "Fotos existentes" : "Fotos (hasta 6)"}
        </label>

        {existingImages.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3">
            {existingImages.map(img => (
              <div key={img.id} className="group relative">
                <Image
                  src={`${img.supabaseUrl}/storage/v1/object/public/work-images/${img.storage_path}`}
                  alt="foto del trabajo"
                  width={88}
                  height={88}
                  className="h-22 w-22 rounded-xl object-cover"
                />
                {onDeleteImage && (
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id, img.storage_path)}
                    disabled={deletingId === img.id}
                    className="absolute -right-1.5 -top-1.5 hidden h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white group-hover:flex disabled:opacity-60"
                  >
                    {deletingId === img.id
                      ? <Loader2 className="h-3 w-3 animate-spin" />
                      : <X className="h-3 w-3" />
                    }
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {existingImages.length > 0 && (
          <p className="mb-2 text-sm text-secondary">Agregar más fotos:</p>
        )}

        {previews.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {previews.map((p, i) => (
              <div key={i} className="relative">
                <Image src={p.url} alt={p.name} width={80} height={80} className="h-20 w-20 rounded-lg object-cover opacity-60" />
                <span className="absolute bottom-0 left-0 right-0 truncate rounded-b-lg bg-black/60 px-1 py-0.5 text-center text-[10px] text-white">{p.name}</span>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 rounded-xl border border-dashed border-white/20 bg-card px-4 py-3 text-sm text-secondary transition-colors hover:border-bronze/40 hover:text-primary"
        >
          <ImagePlus className="h-4 w-4" />
          Seleccionar fotos
        </button>
        <input
          ref={fileRef}
          type="file"
          name="images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="mt-1.5 text-xs text-muted">JPG, PNG o WebP · hasta 10 MB por foto</p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-xl bg-cta px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cta/20 transition-colors hover:bg-cta-dark disabled:opacity-60"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
