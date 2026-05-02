"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/catalogo/actions";

export function DeleteProductButton({ productId, name }: { productId: string; name: string }) {
  async function handleDelete() {
    if (!confirm(`¿Borrar "${name}"? Esta acción no se puede deshacer.`)) return;
    await deleteProduct(productId);
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg p-2 text-secondary transition-colors hover:bg-layer hover:text-red-400"
      title="Borrar producto"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
