"use client";

import { motion } from "motion/react";
import { useReducedMotionPreference } from "@/app/hooks/useReducedMotion";

type PillProps = {
  value: string;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
};

const pillVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.15 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

export const Pill = ({ value, isSelected, isDisabled, onClick }: PillProps) => {
  const prefersReducedMotion = useReducedMotionPreference();
  const variants = prefersReducedMotion
    ? { idle: { scale: 1 }, hover: { scale: 1 }, tap: { scale: 1 } }
    : pillVariants;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative px-4 py-2 rounded-full text-sm font-medium
        border transition-colors duration-150
        ${
          isSelected
            ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
            : "border-zinc-300 bg-white text-zinc-900 hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white dark:hover:border-zinc-500"
        }
        ${
          isDisabled
            ? "opacity-40 cursor-not-allowed line-through"
            : "cursor-pointer"
        }
      `}
      variants={variants}
      initial="idle"
      whileHover={!prefersReducedMotion && !isDisabled ? "hover" : "idle"}
      whileTap={!prefersReducedMotion && !isDisabled ? "tap" : "idle"}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
    >
      {value}
    </motion.button>
  );
};
