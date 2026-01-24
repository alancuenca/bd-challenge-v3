"use client";

import { motion } from "motion/react";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
};

type ModalBackdropProps = {
  onClose: () => void;
};

export const ModalBackdrop = ({ onClose }: ModalBackdropProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      aria-hidden="true"
      onClick={onClose}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    />
  );
};
