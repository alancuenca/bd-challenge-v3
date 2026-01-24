"use client";

import type { ProductOption } from "@/lib/shopify/types";
import { Pill } from "../ui/Pill";

type VariantSelectorProps = {
  options: ProductOption[];
  selectedOptions: Record<string, string>;
  onSelectOption: (optionName: string, optionValue: string) => void;
  isOptionDisabled: (optionName: string, optionValue: string) => boolean;
  isSelected: (optionName: string, optionValue: string) => boolean;
};

export const VariantSelector = ({
  options,
  selectedOptions,
  onSelectOption,
  isOptionDisabled,
  isSelected,
}: VariantSelectorProps) => {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {options.map((option) => (
        <div key={option.id} className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
              {option.name}
            </h3>
            {selectedOptions[option.name] && (
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {selectedOptions[option.name]}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => (
              <Pill
                key={value}
                value={value}
                isSelected={isSelected(option.name, value)}
                isDisabled={isOptionDisabled(option.name, value)}
                onClick={() => onSelectOption(option.name, value)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
