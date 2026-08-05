"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, HeartOff, PackageCheck, ShoppingCart, Tag } from "lucide-react";

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
            <Button className="rounded-xl">Browse products <ArrowRight className="size-4" aria-hidden="true" /></Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="group overflow-hidden border-0 py-0 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.45)] ring-1 ring-border transition-[transform,box-shadow] duration-200 ease-out motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_24px_60px_-36px_rgba(37,99,235,0.3)]"
        >
          <Link href={`/products/${product.id}`}>
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </Link>

          <CardHeader className="px-5 pb-3 pt-5">
            <Link href={`/products/${product.id}`}>
              <CardTitle className="line-clamp-2 break-words text-lg tracking-[-0.02em] transition-colors group-hover:text-primary">{product.name}</CardTitle>
            </Link>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col px-5 pb-5">
            <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
              {product.description}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3"><p className="text-xl font-bold tracking-[-0.02em]">{formatCurrency(product.price)}</p><span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"><Tag className="size-3" aria-hidden="true" /> {product.category}</span></div>
            <p className={`mt-3 flex items-center gap-1.5 text-xs font-semibold ${product.stock > 0 ? "text-success" : "text-destructive"}`}><PackageCheck className="size-3.5" aria-hidden="true" /> {product.stock > 0 ? "In stock and ready to order" : "Currently out of stock"}</p>

            <Button
              className="mt-5 w-full rounded-xl"
              onClick={() => handleAddToCart(product)}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="size-4" aria-hidden="true" />
              {product.stock > 0 ? "Add to cart" : "Out of stock"}
            </Button>
            <div className="mt-2 [&_button]:w-full [&_button]:rounded-xl"><WishlistButton
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
            /></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
