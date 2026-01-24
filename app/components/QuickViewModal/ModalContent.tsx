"use client";

import { forwardRef, useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useProduct } from "@/app/hooks/useProduct";
import { useVariantSelection } from "@/app/hooks/useVariantSelection";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ProductMedia } from "./ProductMedia";
import { ProductInfo, PriceDisplay } from "./ProductInfo";
import { VariantSelector } from "./VariantSelector";
import { AddToBagButton } from "./AddToBagButton";
import { ImageGallery } from "./ImageGallery";

const modalAnimationVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
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
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    // Variant selection hook
    const {
      selectedOptions,
      resolvedVariant,
      selectOption,
      isOptionDisabled,
      isSelected,
    } = useVariantSelection({
      variants: product?.variants.nodes ?? [],
      options: product?.options ?? [],
    });

    // Use resolved variant for display, fallback to first variant
    const activeVariant = resolvedVariant ?? product?.variants.nodes[0] ?? null;
    const activeImage = activeVariant?.image ?? product?.featuredImage ?? null;
    const price = activeVariant?.price ?? product?.priceRange.minVariantPrice ?? null;
    const compareAtPrice = activeVariant?.compareAtPrice ?? null;

    // Check if product has real variants (not just "Default Title")
    const hasRealVariants = product?.options?.some(
      (option) => option.name !== "Title" && option.values.length > 0
    ) ?? false;

    // Button is disabled only if variant is unavailable
    // For products with no real variants, use first variant availability
    const isAddDisabled = !activeVariant?.availableForSale;

    // Get all product images
    const productImages = product?.images.nodes ?? [];
    const hasMultipleImages = productImages.length > 1;

    // Find initial index for gallery (current active image)
    const initialGalleryIndex = activeImage
      ? productImages.findIndex((img) => img.url === activeImage.url)
      : 0;

    return (
      <>
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
            variants={modalAnimationVariants}
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
                <ProductMedia
                  image={activeImage}
                  onClick={productImages.length > 0 ? () => setIsGalleryOpen(true) : undefined}
                  hasMultipleImages={hasMultipleImages}
                />
                <div className="flex flex-col p-6 lg:p-8">
                  <div className="flex flex-1 flex-col overflow-y-auto">
                    <ProductInfo
                      titleId={titleId}
                      title={product.title}
                      description={product.description}
                    />
                  </div>
                  
                  {/* Sticky bottom section with price, variants, and button */}
                  <div className="flex flex-col gap-6 pt-2">
                    {hasRealVariants && (
                      <VariantSelector
                        options={product.options}
                        selectedOptions={selectedOptions}
                        onSelectOption={selectOption}
                        isOptionDisabled={isOptionDisabled}
                        isSelected={isSelected}
                      />
                    )}
                    <PriceDisplay
                      price={price}
                      compareAtPrice={compareAtPrice}
                    />
                    <AddToBagButton disabled={isAddDisabled} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-sm text-zinc-600">
                Product details are unavailable.
              </div>
            )}
          </motion.div>
        </div>

        {/* Image Gallery */}
        <AnimatePresence>
          {isGalleryOpen && productImages.length > 0 && (
            <ImageGallery
              images={productImages}
              initialIndex={Math.max(0, initialGalleryIndex)}
              onClose={() => setIsGalleryOpen(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  },
);

ModalContent.displayName = "ModalContent";
