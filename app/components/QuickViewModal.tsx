"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import type { ProductDetail, ProductVariant, MoneyV2 } from "@/lib/shopify/types";

// ============================================================================
// Types
// ============================================================================

type AddToBagState = "idle" | "loading" | "success";

interface QuickViewModalProps {
  products: Array<{ handle: string }>;
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatPrice(amount: string, currencyCode: string): string {
  const value = Number(amount);
  if (Number.isNaN(value)) return amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}

function resolveVariant(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): ProductVariant | null {
  return (
    variants.find((variant) =>
      variant.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value
      )
    ) ?? null
  );
}

function getAvailableValues(
  variants: ProductVariant[],
  optionName: string,
  currentSelection: Record<string, string>
): Set<string> {
  const available = new Set<string>();
  variants.forEach((variant) => {
    if (!variant.availableForSale) return;
    const matches = variant.selectedOptions.every(
      (opt) =>
        opt.name === optionName ||
        !currentSelection[opt.name] ||
        currentSelection[opt.name] === opt.value
    );
    if (matches) {
      const opt = variant.selectedOptions.find((o) => o.name === optionName);
      if (opt) available.add(opt.value);
    }
  });
  return available;
}

function getInitialOptions(variants: ProductVariant[]): Record<string, string> {
  const firstAvailable = variants.find((v) => v.availableForSale);
  if (!firstAvailable) return {};
  return firstAvailable.selectedOptions.reduce(
    (acc, opt) => ({ ...acc, [opt.name]: opt.value }),
    {}
  );
}

// ============================================================================
// Subcomponents
// ============================================================================

function LoadingSkeleton() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-zinc-100 dark:bg-zinc-800">
        <div className="aspect-square w-full animate-pulse bg-zinc-200 dark:bg-zinc-700" />
        <div className="flex gap-2 p-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 w-16 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700"
            />
          ))}
        </div>
      </div>
      <div className="flex-1 p-6 md:p-8">
        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-8 w-1/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="flex gap-2 pt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700"
              />
            ))}
          </div>
          <div className="h-14 w-full animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}

function OptionPill({
  value,
  isSelected,
  isDisabled,
  onClick,
  reducedMotion,
}: {
  value: string;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`
        px-4 py-2 rounded-full text-sm font-medium border transition-colors
        ${
          isSelected
            ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
            : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
        }
        ${isDisabled ? "opacity-40 cursor-not-allowed line-through" : "cursor-pointer"}
      `}
      whileHover={!reducedMotion && !isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!reducedMotion && !isDisabled ? { scale: 0.98 } : undefined}
      aria-pressed={isSelected}
    >
      {value}
    </motion.button>
  );
}

function AddToBagButton({
  disabled,
  state,
  onAdd,
  reducedMotion,
}: {
  disabled: boolean;
  state: AddToBagState;
  onAdd: () => void;
  reducedMotion: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onAdd}
      disabled={disabled || state !== "idle"}
      className={`
        w-full py-3.5 rounded-full font-bold text-sm md:text-base flex items-center justify-center gap-2
        transition-all shadow-sm active:scale-[0.98]
        ${
          state === "success"
            ? "bg-green-600 text-white"
            : disabled
            ? "bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600"
            : "bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-md dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        }
      `}
      whileHover={!reducedMotion && !disabled && state === "idle" ? { scale: 1.01 } : undefined}
      whileTap={!reducedMotion && !disabled && state === "idle" ? { scale: 0.99 } : undefined}
    >
      {state === "loading" && (
        <motion.span
          className="h-5 w-5 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      {state === "success" && (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      <span>
        {state === "loading" ? "Adding..." : state === "success" ? "Added!" : "Add to Bag"}
      </span>
    </motion.button>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function QuickViewModal({ products }: QuickViewModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productHandle = searchParams.get("product");
  const reducedMotion = useReducedMotion() ?? false;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [addToBagState, setAddToBagState] = useState<AddToBagState>("idle");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isOpen = !!productHandle;

  // Fetch product data when modal opens
  useEffect(() => {
    if (!productHandle) {
      setProduct(null);
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setSelectedOptions({});
    setAddToBagState("idle");
    setSelectedImageIndex(0);

    fetch(`/api/shopify/product?handle=${encodeURIComponent(productHandle)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: { product: ProductDetail | null }) => {
        if (!controller.signal.aborted && data.product) {
          setProduct(data.product);
          setSelectedOptions(getInitialOptions(data.product.variants.nodes));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch product:", err);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [productHandle]);

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const closeModal = useCallback(() => {
    router.push("/", { scroll: false });
  }, [router]);

  const openModal = useCallback(
    (handle: string, trigger?: HTMLElement) => {
      triggerRef.current = trigger ?? null;
      router.push(`/?product=${handle}`, { scroll: false });
    },
    [router]
  );

  // Derived state
  const variants = useMemo(() => product?.variants.nodes ?? [], [product]);
  const resolvedVariant = useMemo(
    () => resolveVariant(variants, selectedOptions),
    [variants, selectedOptions]
  );

  const images = useMemo(() => product?.images.nodes ?? [], [product]);
  const currentImage =
    images[selectedImageIndex] ?? resolvedVariant?.image ?? product?.featuredImage;

  const price: MoneyV2 | null =
    resolvedVariant?.price ?? product?.priceRange.minVariantPrice ?? null;
  const compareAtPrice = resolvedVariant?.compareAtPrice;

  const hasRealVariants = product?.options.some(
    (opt) => opt.name !== "Title" && opt.values.length > 1
  );

  const isAddDisabled = !resolvedVariant?.availableForSale;

  // Update image when variant changes
  useEffect(() => {
    if (resolvedVariant?.image && images.length > 0) {
      const idx = images.findIndex((img) => img.url === resolvedVariant.image?.url);
      if (idx !== -1) setSelectedImageIndex(idx);
    }
  }, [resolvedVariant?.image, images]);

  const handleAddToBag = useCallback(async () => {
    if (isAddDisabled || addToBagState !== "idle") return;
    setAddToBagState("loading");
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
    setAddToBagState("success");
    setTimeout(() => {
      setAddToBagState("idle");
      closeModal();
    }, 1500);
  }, [isAddDisabled, addToBagState, closeModal]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, scale: 0.96, y: 10 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 10 },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              ref={modalRef}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl pointer-events-auto dark:bg-zinc-900"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={product ? "modal-title" : undefined}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                ref={closeButtonRef}
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-zinc-800/90 text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 shadow-lg backdrop-blur-sm transition-colors"
                aria-label="Close"
                whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
                whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Content */}
              <div className="max-h-[90vh] overflow-y-auto">
                {loading ? (
                  <LoadingSkeleton />
                ) : product ? (
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="md:w-1/2 bg-zinc-100 dark:bg-zinc-800">
                      {/* Main Image */}
                      <div className="relative aspect-square">
                        <AnimatePresence mode="wait">
                          {currentImage && (
                            <motion.div
                              key={currentImage.url}
                              className="absolute inset-0"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: reducedMotion ? 0 : 0.2 }}
                            >
                              <Image
                                src={currentImage.url}
                                alt={currentImage.altText || product.title}
                                fill
                                className="object-contain pt-4"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Thumbnails */}
                      {images.length > 1 && (
                        <div className="flex gap-2 p-4 1.5 overflow-x-auto">
                          {images.map((img, idx) => (
                            <motion.button
                              key={img.url}
                              onClick={() => setSelectedImageIndex(idx)}
                              className={`relative shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                idx === selectedImageIndex
                                  ? "border-zinc-900 dark:border-white"
                                  : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-600"
                              }`}
                              whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
                              whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
                            >
                              <Image
                                src={img.url}
                                alt={img.altText || `Thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 flex flex-col">
                      {/* Scrollable Content */}
                      <div className="flex-1 overflow-y-auto px-4 py-5 md:p-8 pb-20 md:pb-8">
                        {/* Title */}
                        <h2
                          id="modal-title"
                          className="text-xl md:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight"
                        >
                          {product.title}
                        </h2>

                        {/* Price - Moved up for better visibility */}
                        {price && (
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">
                              {formatPrice(price.amount, price.currencyCode)}
                            </span>
                            {compareAtPrice &&
                              Number(compareAtPrice.amount) > Number(price.amount) && (
                                <span className="text-sm md:text-base text-zinc-500 line-through">
                                  {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
                                </span>
                              )}
                          </div>
                        )}

                        {/* Description */}
                        {product.description && (
                          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-3 md:line-clamp-none">
                            {product.description}
                          </p>
                        )}

                        {/* Variant Options */}
                        {hasRealVariants && (
                          <div className="mt-5 md:mt-6 space-y-3 md:space-y-4">
                            {product.options
                              .filter((opt) => opt.name !== "Title")
                              .map((option) => {
                                const available = getAvailableValues(
                                  variants,
                                  option.name,
                                  selectedOptions
                                );
                                return (
                                  <div key={option.id}>
                                    <div className="flex items-center justify-between mb-1.5 md:mb-2">
                                      <span className="text-xs md:text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-white">
                                        {option.name}
                                      </span>
                                      {selectedOptions[option.name] && (
                                        <span className="text-xs md:text-sm text-zinc-500">
                                          {selectedOptions[option.name]}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {option.values.map((value) => (
                                        <OptionPill
                                          key={value}
                                          value={value}
                                          isSelected={selectedOptions[option.name] === value}
                                          isDisabled={!available.has(value)}
                                          onClick={() =>
                                            setSelectedOptions((prev) => ({
                                              ...prev,
                                              [option.name]: value,
                                            }))
                                          }
                                          reducedMotion={reducedMotion}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>

                      {/* Add to Bag - Sticky on Mobile */}
                      {/* Slimmer profile, backdrop blur, subtle border */}
                      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-zinc-200/50 dark:border-zinc-800/50 md:static md:bg-transparent md:dark:bg-transparent md:border-t-0 md:px-8 md:pb-8">
                        <AddToBagButton
                          disabled={isAddDisabled}
                          state={addToBagState}
                          onAdd={handleAddToBag}
                          reducedMotion={reducedMotion}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-zinc-500">Product not found</div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Export a hook to open the modal from anywhere
export function useQuickViewModal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const open = useCallback(
    (handle: string) => {
      router.push(`/?product=${handle}`, { scroll: false });
    },
    [router]
  );

  const close = useCallback(() => {
    router.push("/", { scroll: false });
  }, [router]);

  const isOpen = !!searchParams.get("product");

  return { open, close, isOpen };
}
