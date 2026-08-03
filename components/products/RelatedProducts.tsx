"use client";

import { useEffect, useState } from "react";

import ProductsGrid from "./ProductsGrid";
import { ProductGridSkeleton } from "./ProductGridSkeleton";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type RelatedProductsProps = {
  productId: string;
  category: string;
};

export function RelatedProducts({
  productId,
  category,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchRelatedProducts() {
      try {
        const params = new URLSearchParams({
          category,
          limit: "4",
        });

        const res = await fetch(
          `/api/products?${params.toString()}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch related products");
        }

        const data = await res.json();

        if (isMounted) {
          setProducts(
            data.products
              .filter(
                (product: Product) => product.id !== productId
              )
              .slice(0, 3)
          );
        }
      } catch {
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchRelatedProducts();

    return () => {
      isMounted = false;
    };
  }, [productId, category]);

  if (loading) {
    return (
      <section className="space-y-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2">
        <h2 className="text-xl font-bold sm:text-2xl">
          Related Products
        </h2>

        <ProductGridSkeleton count={3} />
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2">
      <h2 className="text-xl font-bold sm:text-2xl">
        Related Products
      </h2>

      <ProductsGrid products={products} />
    </section>
  );
}
