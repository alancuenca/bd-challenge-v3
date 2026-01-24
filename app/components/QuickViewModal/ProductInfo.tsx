"use client";

import { useState, useRef, useEffect } from "react";
import type { MoneyV2 } from "@/lib/shopify/types";
import { motion } from "motion/react";

export const formatPrice = (amount: string, currencyCode: string) => {
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
  titleId?: string;
};

export const ProductInfo = ({
  title,
  description,
  titleId,
}: ProductInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      // Check if content overflows (more than ~4 lines at ~24px line height = 96px)
      const isOverflowing = descriptionRef.current.scrollHeight > 96;
      setShowSeeMore(isOverflowing);
    }
  }, [description]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
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

      {/* Description Section */}
      {description ? (
        <div className="flex flex-col gap-3 pb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
            Description
          </h3>
          <div className="relative">
            <div
              ref={descriptionRef}
              className={`text-sm leading-relaxed text-zinc-600 transition-all duration-300 dark:text-zinc-400 ${
                !isExpanded && showSeeMore ? "line-clamp-4" : ""
              }`}
            >
              {description}
            </div>
            
            {/* Gradient overlay when collapsed */}
            {!isExpanded && showSeeMore && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-white to-transparent dark:from-zinc-900" />
            )}
          </div>

          {/* See More / See Less button */}
          {showSeeMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="self-start text-sm font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
            >
              {isExpanded ? "See less" : "See more"}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
};

type PriceDisplayProps = {
  price: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
};

export const PriceDisplay = ({ price, compareAtPrice }: PriceDisplayProps) => {
  const priceValue = Number(price.amount);
  const compareAtValue = compareAtPrice ? Number(compareAtPrice.amount) : null;
  const showCompareAt =
    compareAtValue !== null &&
    !Number.isNaN(compareAtValue) &&
    compareAtValue > priceValue;

  return (
    <motion.div
      key={price.amount}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-baseline gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-700"
    >
      <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {formatPrice(price.amount, price.currencyCode)}
      </span>
      {showCompareAt && compareAtPrice && (
        <span className="text-lg font-medium text-zinc-400 line-through dark:text-zinc-500">
          {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
        </span>
      )}
    </motion.div>
  );
};
