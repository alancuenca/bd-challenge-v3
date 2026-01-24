import type { ProductCard as ProductCardType } from "@/lib/shopify/types";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  title: string;
  products: ProductCardType[];
};

export const ProductGrid = ({ title, products }: ProductGridProps) => {
  return (
    <section className="grid-container py-10 lg:py-16">
      <div className="flex flex-col gap-3 pb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Featured Collection
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">
          {title}
        </h2>
        <p className="text-base text-zinc-600">
          Curated pieces with thoughtful details and premium materials.
        </p>
      </div>
      <div className="grid-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
