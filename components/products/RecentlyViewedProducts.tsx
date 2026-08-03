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

        setProducts(
          recentlyViewed
            .filter(
              (product): product is Product =>
                typeof product === "object" &&
                product !== null &&
                typeof product.id === "string" &&
                typeof product.name === "string" &&
                typeof product.description === "string" &&
                typeof product.price === "number" &&
                typeof product.image === "string" &&
                typeof product.category === "string" &&
                product.id !== currentProductId
            )
            .slice(0, 4)
        );
      } catch {
        setProducts([]);
      }
    }

    loadRecentlyViewedProducts();
  }, [currentProductId]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">
        Recently Viewed Products
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
          />
        ))}
      </div>
    </section>
  );
}
