"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface WorkImage {
  id: string;
  storage_path: string;
}

interface Props {
  images: WorkImage[];
  title: string;
  supabaseUrl: string;
}

export function WorkGallery({ images, title, supabaseUrl }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const close = useCallback(() => setSelected(null), []);
  const prev = useCallback(() => setSelected(i => (i !== null ? (i - 1 + images.length) % images.length : null)), [images.length]);
  const next = useCallback(() => setSelected(i => (i !== null ? (i + 1) % images.length : null)), [images.length]);

  useEffect(() => {
    if (selected === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, close, prev, next]);

  function imgUrl(path: string) {
    return `${supabaseUrl}/storage/v1/object/public/work-images/${path}`;
  }

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setSelected(i)}
            className={`group relative cursor-zoom-in overflow-hidden rounded-2xl ${i === 0 ? "sm:col-span-2 h-80" : "h-60"}`}
          >
            <Image
              src={imgUrl(img.storage_path)}
              alt={`${title} — foto ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
          </button>
        ))}
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-14 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={imgUrl(images[selected].storage_path)}
              alt={`${title} — foto ${selected + 1}`}
              width={1200}
              height={900}
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
            />
            {images.length > 1 && (
              <p className="mt-2 text-center text-sm text-white/50">
                {selected + 1} / {images.length}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
