/**
 * Shopify Storefront API Types
 * 
 * These types match the GraphQL schema and are used alongside the codegen-generated
 * types in ./graphql/.generated/ for full type safety.
 * 
 * Run `pnpm codegen` to regenerate types from the Shopify schema.
 */

// Base types from Shopify Storefront API
export type MoneyV2 = {
  amount: string;
  currencyCode: string;
};

export type ProductImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: MoneyV2;
  compareAtPrice: MoneyV2 | null;
  image: ProductImage | null;
};

// Product detail for modal view
export type ProductDetail = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: ProductImage | null;
  images: {
    nodes: ProductImage[];
  };
  options: ProductOption[];
  variants: {
    nodes: ProductVariant[];
  };
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
};

// Product card for listing view
export type ProductCard = {
  id: string;
  handle: string;
  title: string;
  featuredImage: ProductImage | null;
  priceRange: {
    minVariantPrice: MoneyV2;
  };
  compareAtPriceRange: {
    minVariantPrice: MoneyV2;
  } | null;
};

// Query response types
export type ProductsData = {
  products: {
    nodes: ProductCard[];
  };
};

export type ProductsVariables = {
  first: number;
};

export type ProductDetailData = {
  product: ProductDetail | null;
};

export type ProductDetailVariables = {
  handle: string;
};
