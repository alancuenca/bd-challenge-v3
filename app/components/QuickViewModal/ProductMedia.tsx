"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ProductImage } from "@/lib/shopify/types";

const imageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

type ProductMediaProps = {
  image: ProductImage | null;
  fallbackImage?: ProductImage | null;
};

export const ProductMedia = ({ image, fallbackImage }: ProductMediaProps) => {
  const activeImage = image ?? fallbackImage;

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 lg:aspect-4/5">
      <AnimatePresence mode="wait">
        {activeImage ? (
          <motion.img
            key={activeImage.url}
            src={activeImage.url}
            alt={activeImage.altText || "Product image"}
            className="h-full w-full object-cover"
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        ) : (
          <motion.div
            key="placeholder"
            className="flex h-full w-full items-center justify-center text-sm text-zinc-500 dark:text-zinc-400"
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            Image coming soon
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
