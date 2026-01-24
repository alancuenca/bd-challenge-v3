"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
  // Initialize with first available variant
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const firstAvailable = getFirstAvailableVariant(variants);
    return getSelectedOptionsFromVariant(firstAvailable);
  });

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
    setSelectedOptions((prev) => ({
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
