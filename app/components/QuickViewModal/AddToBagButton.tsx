"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotionPreference } from "@/app/hooks/useReducedMotion";

type AddToBagStatus = "idle" | "loading" | "success";

type AddToBagButtonProps = {
  disabled: boolean;
  onAdd?: () => void | Promise<void>;
};

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.15 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
  success: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.4, times: [0, 0.5, 1] },
  },
};

const iconVariants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.15 } },
};

export const AddToBagButton = ({ disabled, onAdd }: AddToBagButtonProps) => {
  const [status, setStatus] = useState<AddToBagStatus>("idle");
  const prefersReducedMotion = useReducedMotionPreference();
  const variants = prefersReducedMotion
    ? {
        idle: { scale: 1 },
        hover: { scale: 1 },
        tap: { scale: 1 },
        success: { scale: 1 },
      }
    : buttonVariants;
  const iconVariantsToUse = prefersReducedMotion
    ? {
        initial: { opacity: 0, scale: 1 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.01 } },
        exit: { opacity: 0, scale: 1, transition: { duration: 0.01 } },
      }
    : iconVariants;

  const handleClick = useCallback(async () => {
    if (disabled || status !== "idle") {
      return;
    }

    setStatus("loading");

    // Simulate async add (800-1200ms as per README requirements)
    const delay = 800 + Math.random() * 400;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Call optional onAdd callback
    if (onAdd) {
      await onAdd();
    }

    setStatus("success");

    // Auto-reset after 1.5s
    setTimeout(() => {
      setStatus("idle");
    }, 1500);
  }, [disabled, status, onAdd]);

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled || status !== "idle"}
      className={`
        w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full
        text-base font-semibold transition-colors duration-150
        ${
          status === "success"
            ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            : status === "loading"
            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
            : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        }
        ${
          disabled && status === "idle"
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }
      `}
      variants={variants}
      initial="idle"
      animate={status === "success" ? "success" : "idle"}
      whileHover={
        !prefersReducedMotion && !disabled && status === "idle" ? "hover" : "idle"
      }
      whileTap={
        !prefersReducedMotion && !disabled && status === "idle" ? "tap" : "idle"
      }
      aria-busy={status === "loading"}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.svg
            key="spinner"
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            variants={iconVariantsToUse}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </motion.svg>
        )}
        {status === "success" && (
          <motion.svg
            key="check"
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
            variants={iconVariantsToUse}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        )}
      </AnimatePresence>
      <span>
        {status === "loading"
          ? "Adding..."
          : status === "success"
          ? "Added!"
          : "Add to Bag"}
      </span>
    </motion.button>
  );
};
