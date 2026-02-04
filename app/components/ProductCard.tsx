"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { ProductCard as ProductCardType } from "@/lib/shopify/types";
import { useQuickViewModal } from "./QuickViewModal";

function formatPrice(amount: string, currencyCode: string): string {
  const value = Number(amount);
  if (Number.isNaN(value)) return amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}

type ProductCardProps = {
  product: ProductCardType;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { open } = useQuickViewModal();
  const cardRef = useRef<HTMLDivElement>(null);
  const prefetchedRef = useRef(false);

  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  const image = product.featuredImage;
  const showCompareAt =
    compareAt &&
    Number(compareAt.amount) > Number(price.amount);

  // Prefetch product data on hover
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleHover = () => {
      if (prefetchedRef.current) return;
      prefetchedRef.current = true;
      // Prefetch product data
      fetch(`/api/shopify/product?handle=${encodeURIComponent(product.handle)}`, {
        method: "GET",
      }).catch(() => {});
    };

    card.addEventListener("mouseenter", handleHover);
    card.addEventListener("focus", handleHover, true);

    return () => {
      card.removeEventListener("mouseenter", handleHover);
      card.removeEventListener("focus", handleHover, true);
    };
  }, [product.handle]);

  const handleQuickView = () => {
    open(product.handle);
  };

  return (
    <motion.article
      ref={cardRef}
      className="group col-span-4 flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 transition-shadow hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {image ? (
          <Image
            src={image.url}
            width={image.width ?? 800}
            height={image.height ?? 800}
            alt={image.altText || product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-zinc-900 dark:text-white line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
            {showCompareAt && (
              <span className="text-xs text-zinc-400 line-through">
                {formatPrice(compareAt.amount, compareAt.currencyCode)}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleQuickView}
          className="mt-auto w-full rounded-full bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
        >
          Quick View
        </button>
      </div>
    </motion.article>
  );
}
