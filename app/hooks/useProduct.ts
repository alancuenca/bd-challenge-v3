"use client";

import { useEffect, useState } from "react";
import type { ProductDetail } from "@/lib/shopify/types";

type UseProductResult = {
  product: ProductDetail | null;
  isLoading: boolean;
  isEmpty: boolean;
  error: Error | null;
};

export const useProduct = (handle: string | null): UseProductResult => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!handle) {
      setProduct(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/shopify/product?handle=${encodeURIComponent(handle)}`,
          { signal: abortController.signal },
        );

        if (!response.ok) {
          throw new Error("Unable to load product");
        }

        const data = (await response.json()) as { product: ProductDetail | null };
        if (!abortController.signal.aborted) {
          setProduct(data.product ?? null);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err as Error);
          setProduct(null);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();

    return () => abortController.abort();
  }, [handle]);

  const isEmpty = !product && !isLoading && !error;

  return { product, isLoading, isEmpty, error };
};
