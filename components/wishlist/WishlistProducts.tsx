"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HeartOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { toastSuccess } from "@/components/ui/toast";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatCurrency";

import { WishlistButton } from "./WishlistButton";

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
  const { addToCart } = useCart();

  const [products, setProducts] =
    useState<WishlistProduct[]>(initialProducts);

  function handleAddToCart(product: WishlistProduct) {
    addToCart({
      ...product,
      quantity: 1,
    });

    toastSuccess(`${product.name} added to your cart.`);
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<HeartOff className="size-6" aria-hidden="true" />}
        title="Your wishlist is empty"
        description="Save products you want to revisit later."
        action={
          <Link href="/products">
            <Button>Browse products</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group overflow-hidden transition-[transform,box-shadow] duration-200 ease-out motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md"
        >
          <Link href={`/products/${product.id}`}>
            <div className="relative h-44 w-full sm:h-48">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </Link>

          <CardHeader className="pb-3">
            <Link href={`/products/${product.id}`}>
              <CardTitle className="break-words text-lg">{product.name}</CardTitle>
            </Link>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {product.description}
            </p>

            <p className="text-lg font-bold">
              {formatCurrency(product.price)}
            </p>

            <p className="text-sm text-muted-foreground">
              {product.category}
            </p>

            <Button
              className="w-full"
              onClick={() => handleAddToCart(product)}
              disabled={product.stock <= 0}
            >
              {product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </Button>

            <WishlistButton
              productId={product.id}
              onWishlistChange={(isWishlisted) => {
                if (!isWishlisted) {
                  setProducts((current) =>
                    current.filter(
                      (item) => item.id !== product.id
                    )
                  );
                }
              }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
