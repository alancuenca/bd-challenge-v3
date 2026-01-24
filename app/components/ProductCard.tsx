"use client";

import { useRef } from "react";
import Image from "next/image";
import type { ProductCard as ProductCardType } from "@/lib/shopify/types";
import { useQuickView } from "./QuickViewModal";

const formatPrice = (amount: string, currencyCode: string) => {
  const value = Number(amount);

  if (Number.isNaN(value)) {
    return amount;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(value);
};

type ProductCardProps = {
  product: ProductCardType;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const { open } = useQuickView();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  const image = product.featuredImage;
  const priceValue = Number(price.amount);
  const compareAtValue = compareAt ? Number(compareAt.amount) : null;
  const showCompareAt =
    compareAtValue !== null &&
    !Number.isNaN(compareAtValue) &&
    compareAtValue > priceValue;

  return (
    <article className="product-card group col-span-4 flex flex-col overflow-hidden">
      <div className="relative aspect-4/5 w-full overflow-hidden bg-zinc-100">
        {image ? (
          <Image
            src={image.url}
            width={image.width ?? 800}
            height={image.height ?? 1000}
            alt={image.altText || product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
            Image coming soon
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-2">
          <h3 className="truncate text-lg font-semibold tracking-tight text-zinc-900">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <span>{formatPrice(price.amount, price.currencyCode)}</span>
            {showCompareAt && compareAt && (
              <span className="text-xs text-zinc-400 line-through">
                {formatPrice(compareAt.amount, compareAt.currencyCode)}
              </span>
            )}
          </div>
        </div>
        <button
          ref={buttonRef}
          className="btn-secondary w-full"
          type="button"
          aria-haspopup="dialog"
          onClick={() => open(product.handle, buttonRef)}
        >
          Quick View
        </button>
      </div>
    </article>
  );
};
