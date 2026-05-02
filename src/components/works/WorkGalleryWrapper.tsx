"use client";

import dynamic from "next/dynamic";

export const WorkGalleryClient = dynamic(
  () => import("./WorkGallery").then(m => m.WorkGallery),
  {
    ssr: false,
    loading: () => <div className="mt-8 h-80 animate-pulse rounded-2xl bg-layer" />,
  }
);
