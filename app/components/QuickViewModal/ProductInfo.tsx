"use client";

import type { MoneyV2 } from "@/lib/shopify/types";

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

type ProductInfoProps = {
  title: string;
  description?: string;
  price: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  titleId?: string;
};

export const ProductInfo = ({
  title,
  description,
  price,
  compareAtPrice,
  titleId,
}: ProductInfoProps) => {
  const priceValue = Number(price.amount);
  const compareAtValue = compareAtPrice ? Number(compareAtPrice.amount) : null;
  const showCompareAt =
    compareAtValue !== null &&
    !Number.isNaN(compareAtValue) &&
    compareAtValue > priceValue;

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Quick View
          </p>
          <h2
            id={titleId}
            className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 lg:text-3xl"
          >
            {title}
          </h2>
        </div>
        
        {/* Price Section */}
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {showCompareAt && compareAtPrice && (
            <span className="text-lg font-medium text-zinc-400 line-through dark:text-zinc-500">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </span>
          )}
        </div>
      </div>

      {/* Description Section */}
      {description ? (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
            Description
          </h3>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>
      ) : null}
    </div>
  );
};
