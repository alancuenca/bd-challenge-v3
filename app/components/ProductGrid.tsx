import type { ProductCard as ProductCardType } from "@/lib/shopify/types";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  title: string;
  products: ProductCardType[];
};

export function ProductGrid({ title, products }: ProductGridProps) {
  return (
    <section className="grid-container py-10 lg:py-16">
      <div className="flex flex-col gap-2 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white lg:text-4xl">
          {title}
        </h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400">
          {products.length} products
        </p>
      </div>
      <div className="grid-12">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index < 4} />
        ))}
      </div>
    </section>
  );
}
