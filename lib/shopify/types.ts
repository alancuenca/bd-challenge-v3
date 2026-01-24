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

export type CollectionProductsData = {
  collection: {
    title: string;
    products: {
      nodes: ProductCard[];
    };
  } | null;
};

export type CollectionProductsVariables = {
  handle: string;
  first?: number;
};

export type ProductsData = {
  products: {
    nodes: ProductCard[];
  };
};

export type ProductsVariables = {
  first: number;
};
