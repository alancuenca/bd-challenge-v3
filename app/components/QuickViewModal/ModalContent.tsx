"use client";

import { forwardRef, useId } from "react";
import { motion } from "motion/react";
import { useProduct } from "@/app/hooks/useProduct";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ProductMedia } from "./ProductMedia";
import { ProductInfo } from "./ProductInfo";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } },
};

const closeButtonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1, rotate: 90, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

type ModalContentProps = {
  onClose: () => void;
  productHandle: string | null;
};

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ onClose, productHandle }, ref) => {
    const titleId = useId();
    const { product, isLoading, error } = useProduct(productHandle);
    const initialVariant = product?.variants.nodes[0] ?? null;
    const activeImage = initialVariant?.image ?? product?.featuredImage ?? null;
    const price =
      initialVariant?.price ?? product?.priceRange.minVariantPrice ?? null;
    const compareAtPrice = initialVariant?.compareAtPrice ?? null;

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4" 
        role="presentation"
        onClick={onClose}
      >
        <motion.div
          ref={ref}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-zinc-900"
          role="dialog"
          aria-modal="true"
          aria-labelledby={product ? titleId : undefined}
          tabIndex={-1}
          onClick={(event) => event.stopPropagation()}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.button
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-zinc-600 backdrop-blur-sm transition-colors hover:bg-white dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:bg-zinc-800"
            onClick={onClose}
            type="button"
            aria-label="Close quick view"
            variants={closeButtonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            ×
          </motion.button>
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="p-6 text-sm text-zinc-600">
              We ran into an issue loading this product. Please try again.
            </div>
          ) : product && price ? (
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
              <ProductMedia image={activeImage} />
              <div className="flex flex-col p-6 lg:p-8">
                <ProductInfo
                  titleId={titleId}
                  title={product.title}
                  description={product.description}
                  price={price}
                  compareAtPrice={compareAtPrice}
                />
              </div>
            </div>
          ) : (
            <div className="p-6 text-sm text-zinc-600">
              Product details are unavailable.
            </div>
          )}
        </motion.div>
      </div>
    );
  },
);

ModalContent.displayName = "ModalContent";
