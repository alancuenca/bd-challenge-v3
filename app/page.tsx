import { client } from "@/lib/shopify/serverClient";
import { getProducts } from "@/lib/shopify/graphql/query";
import type { ProductsData, ProductsVariables } from "@/lib/shopify/types";
import { ProductGrid } from "./components/ProductGrid";

export default async function Home() {
  "use cache";
  const variables: ProductsVariables = {
    first: 12,
  };
  const resp = await client.request(getProducts, { variables });
  const data = resp.data as ProductsData | undefined;
  const products = data?.products.nodes ?? [];
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {products.length > 0 ? (
        <ProductGrid title="All Products" products={products} />
      ) : (
        <section className="grid-container py-16">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              No products found
            </h2>
            <p className="text-muted mt-3 text-base">
              Check your Shopify store connection and ensure products are
              published.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
