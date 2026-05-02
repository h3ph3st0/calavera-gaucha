"use client";

import { Trash2 } from "lucide-react";
import { deleteWork } from "@/app/admin/works/actions";

export function DeleteWorkButton({ workId, title }: { workId: string; title: string }) {
  async function handleDelete() {
    if (!confirm(`¿Borrar "${title}" y todas sus fotos?`)) return;
    await deleteWork(workId);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-lg p-2 text-secondary transition-colors hover:bg-red-500/10 hover:text-red-400"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
