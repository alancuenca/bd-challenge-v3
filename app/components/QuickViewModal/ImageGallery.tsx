"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ProductImage } from "@/lib/shopify/types";
import { useReducedMotionPreference } from "@/app/hooks/useReducedMotion";

type ImageGalleryProps = {
  images: ProductImage[];
  initialIndex?: number;
  onClose: () => void;
};

const galleryVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const imageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  }),
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.15 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

export const ImageGallery = ({
  images,
  initialIndex = 0,
  onClose,
}: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const prefersReducedMotion = useReducedMotionPreference();
  const galleryVariantsToUse = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.01 } },
        exit: { opacity: 0, transition: { duration: 0.01 } },
      }
    : galleryVariants;
  const imageVariantsToUse = prefersReducedMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1, transition: { duration: 0.01 } },
        exit: { opacity: 0, transition: { duration: 0.01 } },
      }
    : imageVariants;
  const buttonVariantsToUse = prefersReducedMotion
    ? {
        initial: { scale: 1 },
        hover: { scale: 1 },
        tap: { scale: 1 },
      }
    : buttonVariants;

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const currentImage = images[currentIndex];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-900"
      variants={galleryVariantsToUse}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header with back button */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
        <motion.button
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
          variants={buttonVariantsToUse}
          initial="initial"
          whileHover={prefersReducedMotion ? "initial" : "hover"}
          whileTap={prefersReducedMotion ? "initial" : "tap"}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </motion.button>
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Main image area */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={currentIndex}
            src={currentImage.url}
            alt={currentImage.altText || `Image ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain"
            custom={direction}
            variants={imageVariantsToUse}
            initial="enter"
            animate="center"
            exit="exit"
          />
        </AnimatePresence>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              onClick={handlePrevious}
              className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-lg backdrop-blur-sm transition-colors hover:bg-white dark:bg-zinc-800/90 dark:text-zinc-100 dark:hover:bg-zinc-800"
              variants={buttonVariantsToUse}
              initial="initial"
              whileHover={prefersReducedMotion ? "initial" : "hover"}
              whileTap={prefersReducedMotion ? "initial" : "tap"}
              aria-label="Previous image"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>
            <motion.button
              onClick={handleNext}
              className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-lg backdrop-blur-sm transition-colors hover:bg-white dark:bg-zinc-800/90 dark:text-zinc-100 dark:hover:bg-zinc-800"
              variants={buttonVariantsToUse}
              initial="initial"
              whileHover={prefersReducedMotion ? "initial" : "hover"}
              whileTap={prefersReducedMotion ? "initial" : "tap"}
              aria-label="Next image"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <motion.button
                key={image.url}
                onClick={() => handleThumbnailClick(index)}
                className={`relative shrink-0 overflow-hidden rounded-lg transition-all ${
                  index === currentIndex
                    ? "ring-2 ring-zinc-900 ring-offset-2 dark:ring-zinc-100 dark:ring-offset-zinc-900"
                    : "opacity-60 hover:opacity-100"
                }`}
                variants={buttonVariantsToUse}
                initial="initial"
                whileHover={prefersReducedMotion ? "initial" : "hover"}
                whileTap={prefersReducedMotion ? "initial" : "tap"}
              >
                <img
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index + 1}`}
                  className="h-20 w-20 object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
