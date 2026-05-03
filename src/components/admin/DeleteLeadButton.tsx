"use client";

import { Trash2 } from "lucide-react";
import { deleteLead } from "@/app/admin/(panel)/leads/actions";

export function DeleteLeadButton({ leadId, name }: { leadId: string; name: string }) {
  async function handleDelete() {
    if (!confirm(`¿Borrar el pedido de "${name}"?`)) return;
    await deleteLead(leadId);
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
