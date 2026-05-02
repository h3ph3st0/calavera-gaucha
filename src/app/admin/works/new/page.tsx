import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { WorkForm } from "@/components/admin/WorkForm";
import { createWork } from "../actions";

export const metadata: Metadata = { title: "Nuevo trabajo — Admin" };

export default function NewWorkPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/works" className="mb-6 flex items-center gap-1 text-sm text-secondary hover:text-primary">
        <ChevronLeft className="h-4 w-4" />
        Volver a trabajos
      </Link>
      <h1 className="mb-6 text-xl font-bold text-primary">Nuevo trabajo</h1>
      <WorkForm action={createWork} submitLabel="Publicar trabajo" />
    </div>
  );
}
