"use client";

import { useEffect, useState } from "react";

import { ProductCard } from "./ProductCard";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type RecentlyViewedProductsProps = {
  currentProductId: string;
};

const KEY = "recentlyViewed";

export function RecentlyViewedProducts({
  currentProductId,
}: RecentlyViewedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRecentlyViewedProducts() {
      try {
        const saved = localStorage.getItem(KEY);

        if (!saved) {
          setProducts([]);
          return;
        }

        const recentlyViewed = JSON.parse(saved);

        if (!Array.isArray(recentlyViewed)) {
          setProducts([]);
          return;
        }

        const cachedProducts = recentlyViewed
          .filter(
            (product): product is Product =>
              typeof product === "object" &&
              product !== null &&
              typeof product.id === "string" &&
              product.id !== currentProductId
          )
          .slice(0, 4);

        if (cachedProducts.length === 0) {
          setProducts([]);
          return;
        }

        const params = new URLSearchParams({ limit: "4" });
        cachedProducts.forEach((product) => params.append("id", product.id));

        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to validate recently viewed products");
        }

        const data: { products: Product[] } = await response.json();
        const productsById = new Map(
          data.products.map((product) => [product.id, product])
        );

        setProducts(
          cachedProducts.flatMap((product) => {
            const approvedProduct = productsById.get(product.id);
            return approvedProduct ? [approvedProduct] : [];
          })
        );
      } catch {
        if (!controller.signal.aborted) {
          setProducts([]);
        }
      }
    }

    loadRecentlyViewedProducts();

    return () => controller.abort();
  }, [currentProductId]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border/70 pt-12">
      <div className="mb-6"><p className="text-sm font-semibold text-primary">Continue browsing</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">Recently viewed</h2></div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6" aria-label="Recently viewed products">
        {products.map((product) => (
          <li key={product.id} className="h-full"><ProductCard {...product} /></li>
        ))}
      </ul>
    </section>
  );
}
