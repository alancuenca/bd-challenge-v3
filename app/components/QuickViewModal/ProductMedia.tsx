"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ProductImage } from "@/lib/shopify/types";
import { useReducedMotionPreference } from "@/app/hooks/useReducedMotion";

const imageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

type ProductMediaProps = {
  image: ProductImage | null;
  fallbackImage?: ProductImage | null;
  onClick?: () => void;
  hasMultipleImages?: boolean;
};

export const ProductMedia = ({ 
  image, 
  fallbackImage,
  onClick,
  hasMultipleImages = false,
}: ProductMediaProps) => {
  const activeImage = image ?? fallbackImage;
  const prefersReducedMotion = useReducedMotionPreference();
  const variants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.01 } },
        exit: { opacity: 0, transition: { duration: 0.01 } },
      }
    : imageVariants;

  return (
    <button
      onClick={onClick}
      className="group relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 lg:aspect-4/5"
      type="button"
      disabled={!onClick}
    >
      <AnimatePresence mode="wait">
        {activeImage ? (
          <motion.img
            key={activeImage.url}
            src={activeImage.url}
            alt={activeImage.altText || "Product image"}
            className={
              prefersReducedMotion
                ? "h-full w-full object-cover"
                : "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            }
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        ) : (
          <motion.div
            key="placeholder"
            className="flex h-full w-full items-center justify-center text-sm text-zinc-500 dark:text-zinc-400"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            Image coming soon
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand icon overlay */}
      {onClick && activeImage && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
          <motion.div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/0 text-white opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:bg-white/90 group-hover:text-zinc-900 group-hover:opacity-100"
            initial={{ scale: 0.8 }}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
              />
            </svg>
          </motion.div>
        </div>
      )}

      {/* Badge for multiple images */}
      {hasMultipleImages && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          View Gallery
        </div>
      )}
    </button>
  );
};
