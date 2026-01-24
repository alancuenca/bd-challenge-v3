"use client";

import { useEffect, useCallback } from "react";

const focusableSelectors = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable='true']",
].join(",");

type FocusTrapOptions = {
  containerRef: React.RefObject<HTMLElement>;
  isActive: boolean;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

export const useFocusTrap = ({
  containerRef,
  isActive,
  returnFocusRef,
}: FocusTrapOptions) => {
  // Get focusable elements dynamically (content may change after loading)
  const getFocusableElements = useCallback(() => {
    const container = containerRef.current;
    if (!container) return [];
    return Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors)
    );
  }, [containerRef]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Focus first element after a short delay to allow content to render
    const focusTimeout = setTimeout(() => {
      const focusableElements = getFocusableElements();
      const focusTarget = focusableElements[0] ?? container;
      focusTarget.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      // Get fresh list of focusable elements each time (content may have changed)
      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.removeEventListener("keydown", handleKeyDown);
      if (returnFocusRef?.current) {
        returnFocusRef.current.focus();
      } else {
        previouslyFocused?.focus();
      }
    };
  }, [containerRef, isActive, returnFocusRef, getFocusableElements]);
};
