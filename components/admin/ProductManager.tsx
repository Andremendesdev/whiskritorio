"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductTable } from "@/components/admin/ProductTable";
import { ToastContainer, useToast } from "@/components/admin/AdminToast";
import { useProducts } from "@/hooks/useProducts";
import type { Product, ProductInput } from "@/types";

export function ProductManager() {
  const router = useRouter();
  const { products, loading, error, createProduct, updateProduct, removeProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toasts, push, dismiss } = useToast();

  async function handleSubmit(input: ProductInput) {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, input);
        setEditingProduct(null);
        router.refresh();
        push(`"${input.name}" atualizado com sucesso.`, "success");
      } else {
        await createProduct(input);
        router.refresh();
        push(`"${input.name}" criado no cardápio.`, "success");
      }
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao salvar produto.", "error");
    }
  }

  async function handleDelete(id: string) {
    const target = products.find((p) => p.id === id);
    if (!window.confirm(`Deletar "${target?.name ?? "produto"}"?`)) return;
    try {
      await removeProduct(id);
      if (editingProduct?.id === id) setEditingProduct(null);
      router.refresh();
      push(`"${target?.name ?? "Produto"}" removido.`, "info");
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao remover produto.", "error");
    }
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <div className="space-y-6">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--neon)]">CRUD</p>
          <h1 className="mt-2 text-5xl uppercase text-white" style={{ fontFamily: "var(--font-bebas)" }}>
            Produtos
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Crie, edite, delete e liste os itens do cardápio.
          </p>
        </section>

        {error && (
          <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-1 xl:grid-cols-[minmax(340px,420px)_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-24">
            <ProductForm
              editingProduct={editingProduct}
              onSubmit={handleSubmit}
              onCancel={() => setEditingProduct(null)}
            />
          </div>
          <ProductTable
            products={products}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
}
