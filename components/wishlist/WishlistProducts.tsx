"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, HeartOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/products/ProductCard";

type WishlistProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

type WishlistProductsProps = {
  initialProducts: WishlistProduct[];
};

export function WishlistProducts({
  initialProducts,
}: WishlistProductsProps) {
  const [products, setProducts] =
    useState<WishlistProduct[]>(initialProducts);

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<HeartOff className="size-6" aria-hidden="true" />}
        title="Your wishlist is empty"
        description="Save products you want to revisit later."
        action={
          <Link href="/products">
            <Button className="rounded-xl">Browse products <ArrowRight className="size-4" aria-hidden="true" /></Button>
          </Link>
        }
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6" aria-label="Wishlist products">
      {products.map((product) => (
        <li key={product.id} className="h-full">
          <ProductCard
            {...product}
            onWishlistChange={(isWishlisted) => {
              if (!isWishlisted) {
                setProducts((current) => current.filter((item) => item.id !== product.id));
              }
            }}
          />
        </li>
      ))}
    </ul>
  );
}
