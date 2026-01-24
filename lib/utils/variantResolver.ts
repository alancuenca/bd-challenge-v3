import type { ProductVariant, ProductOption, SelectedOption } from "@/lib/shopify/types";

/**
 * Resolves a product variant based on selected options
 * @param variants - All available product variants
 * @param selectedOptions - User's selected options (e.g., { "Size": "M", "Color": "Black" })
 * @returns The matching variant or null if no match found
 */
export function resolveVariant(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): ProductVariant | null {
  // Find variant where all selected options match
  return variants.find((variant) => {
    return variant.selectedOptions.every((option) => {
      const selectedValue = selectedOptions[option.name];
      return selectedValue === option.value;
    });
  }) ?? null;
}

/**
 * Get available option values based on current selection
 * @param variants - All product variants
 * @param options - All product options
 * @param selectedOptions - Currently selected options
 * @returns Map of option names to available values with availability status
 */
export function getAvailableOptions(
  variants: ProductVariant[],
  options: ProductOption[],
  selectedOptions: Record<string, string>
): Record<string, Set<string>> {
  const availableOptions: Record<string, Set<string>> = {};

  // Initialize with all option values
  options.forEach((option) => {
    availableOptions[option.name] = new Set<string>();
  });

  // For each variant that's available for sale
  variants.forEach((variant) => {
    if (!variant.availableForSale) {
      return;
    }

    // Check if this variant matches current partial selection
    const matchesSelection = Object.entries(selectedOptions).every(
      ([optionName, optionValue]) => {
        const variantOption = variant.selectedOptions.find(
          (opt) => opt.name === optionName
        );
        return !variantOption || variantOption.value === optionValue;
      }
    );

    // If it matches, all its options are available
    if (matchesSelection) {
      variant.selectedOptions.forEach((option) => {
        availableOptions[option.name].add(option.value);
      });
    }
  });

  return availableOptions;
}

/**
 * Check if a specific option value is available given current selection
 * @param variants - All product variants
 * @param selectedOptions - Currently selected options
 * @param optionName - The option to check (e.g., "Size")
 * @param optionValue - The value to check (e.g., "M")
 * @returns true if this combination is available
 */
export function isOptionAvailable(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>,
  optionName: string,
  optionValue: string
): boolean {
  // Create a test selection with this option value
  const testSelection = {
    ...selectedOptions,
    [optionName]: optionValue,
  };

  // Check if any variant matches and is available
  return variants.some((variant) => {
    if (!variant.availableForSale) {
      return false;
    }

    return Object.entries(testSelection).every(([name, value]) => {
      const variantOption = variant.selectedOptions.find(
        (opt) => opt.name === name
      );
      return variantOption && variantOption.value === value;
    });
  });
}

/**
 * Get the first available variant (useful for initial selection)
 * @param variants - All product variants
 * @returns The first available variant or null
 */
export function getFirstAvailableVariant(
  variants: ProductVariant[]
): ProductVariant | null {
  return variants.find((v) => v.availableForSale) ?? null;
}

/**
 * Create initial selectedOptions from a variant
 * @param variant - The variant to use for initial selection
 * @returns Selected options record
 */
export function getSelectedOptionsFromVariant(
  variant: ProductVariant | null
): Record<string, string> {
  if (!variant) {
    return {};
  }

  return variant.selectedOptions.reduce((acc, option) => {
    acc[option.name] = option.value;
    return acc;
  }, {} as Record<string, string>);
}
