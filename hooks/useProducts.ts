"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet, apiSend } from "@/lib/api";
import type { Product, ProductInput } from "@/types";

type ProductsListener = (source: string) => void;

const productListeners = new Set<ProductsListener>();

function notifyProductsChanged(source: string) {
  productListeners.forEach((listener) => listener(source));
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sourceRef = useRef(`products-${Math.random().toString(36).slice(2)}`);
  const requestRef = useRef(0);

  const refresh = useCallback(async (options?: { silent?: boolean }) => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    if (!options?.silent) setLoading(true);
    setError(null);
    try {
      const freshProducts = await apiGet<Product[]>("/api/products");
      if (requestRef.current === requestId) {
        setProducts(freshProducts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar produtos.");
    } finally {
      if (requestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    function onProductsChanged(source: string) {
      if (source === sourceRef.current) return;
      void refresh({ silent: true });
    }

    productListeners.add(onProductsChanged);
    return () => {
      productListeners.delete(onProductsChanged);
    };
  }, [refresh]);

  const createProduct = useCallback(async (input: ProductInput) => {
    const created = await apiSend<Product>("/api/products", "POST", input);
    await refresh({ silent: true });
    notifyProductsChanged(sourceRef.current);
    return created;
  }, [refresh]);

  const updateProduct = useCallback(async (id: string, input: ProductInput) => {
    const updated = await apiSend<Product>(`/api/products/${id}`, "PUT", input);
    await refresh({ silent: true });
    notifyProductsChanged(sourceRef.current);
    return updated;
  }, [refresh]);

  const removeProduct = useCallback(async (id: string) => {
    await apiSend(`/api/products/${id}`, "DELETE");
    await refresh({ silent: true });
    notifyProductsChanged(sourceRef.current);
  }, [refresh]);

  return { products, loading, error, refresh, createProduct, updateProduct, removeProduct };
}
