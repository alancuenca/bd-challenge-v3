"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import type { ProductVariant, ProductOption } from "@/lib/shopify/types";
import {
  resolveVariant,
  getAvailableOptions,
  isOptionAvailable,
  getFirstAvailableVariant,
  getSelectedOptionsFromVariant,
} from "@/lib/utils/variantResolver";

type UseVariantSelectionParams = {
  variants: ProductVariant[];
  options: ProductOption[];
};

type UseVariantSelectionReturn = {
  selectedOptions: Record<string, string>;
  resolvedVariant: ProductVariant | null;
  availableOptions: Record<string, Set<string>>;
  selectOption: (optionName: string, optionValue: string) => void;
  isOptionDisabled: (optionName: string, optionValue: string) => boolean;
  isSelected: (optionName: string, optionValue: string) => boolean;
};

export function useVariantSelection({
  variants,
  options,
}: UseVariantSelectionParams): UseVariantSelectionReturn {
  // Track product changes by variant ID
  const productKey = variants[0]?.id ?? "";
  const lastProductKey = useRef(productKey);
  
  // Get default selection from first available variant
  const defaultSelection = useMemo(() => {
    const firstAvailable = getFirstAvailableVariant(variants);
    return getSelectedOptionsFromVariant(firstAvailable);
  }, [variants]);

  // Reset state when product changes
  const [userSelections, setUserSelections] = useState<Record<string, string>>({});
  
  // Check if product changed and reset user selections
  if (productKey !== lastProductKey.current) {
    lastProductKey.current = productKey;
    // Reset user selections on product change (will be applied on next render)
    if (Object.keys(userSelections).length > 0) {
      setUserSelections({});
    }
  }

  // Merge default selection with user selections (user selections take priority)
  const selectedOptions = useMemo(() => ({
    ...defaultSelection,
    ...userSelections,
  }), [defaultSelection, userSelections]);

  // Resolve the current variant based on selected options
  const resolvedVariant = useMemo(() => {
    // Only resolve if all options are selected
    const allOptionsSelected = options.every(
      (option) => selectedOptions[option.name] !== undefined
    );

    if (!allOptionsSelected) {
      return null;
    }

    return resolveVariant(variants, selectedOptions);
  }, [variants, selectedOptions, options]);

  // Calculate available options based on current selection
  const availableOptions = useMemo(() => {
    return getAvailableOptions(variants, options, selectedOptions);
  }, [variants, options, selectedOptions]);

  // Select an option value
  const selectOption = useCallback((optionName: string, optionValue: string) => {
    setUserSelections((prev) => ({
      ...prev,
      [optionName]: optionValue,
    }));
  }, []);

  // Check if an option value is disabled
  const isOptionDisabled = useCallback(
    (optionName: string, optionValue: string) => {
      return !isOptionAvailable(variants, selectedOptions, optionName, optionValue);
    },
    [variants, selectedOptions]
  );

  // Check if an option value is currently selected
  const isSelected = useCallback(
    (optionName: string, optionValue: string) => {
      return selectedOptions[optionName] === optionValue;
    },
    [selectedOptions]
  );

  return {
    selectedOptions,
    resolvedVariant,
    availableOptions,
    selectOption,
    isOptionDisabled,
    isSelected,
  };
}
