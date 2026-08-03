"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            Your wishlist is empty.
          </p>

          <Link href="/products">
            <Button className="mt-4">
              Browse products
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden transition hover:scale-[1.02]"
        >
          <Link href={`/products/${product.id}`}>
            <div className="relative h-48 w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </Link>

          <CardHeader>
            <Link href={`/products/${product.id}`}>
              <CardTitle>{product.name}</CardTitle>
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
