"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ImageOff, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toastSuccess } from "@/components/ui/toast";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatCurrency";

type ProductProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
  store?: { name: string; slug: string } | null;
};

export function ProductCard({ id, name, description, price, image, category, stock, store }: ProductProps) {
  const { addToCart } = useCart();
  const [imageFailed, setImageFailed] = useState(false);
  const hasKnownStock = stock !== undefined;
  const isOutOfStock = hasKnownStock && stock <= 0;

  function handleAddToCart() {
    if (stock === undefined || stock <= 0) return;
    addToCart({ id, name, price: Number(price), image, quantity: 1, stock });
    toastSuccess(`${name} added to your cart.`);
  }

  return (
    <Card className="group h-full gap-0 overflow-hidden py-0 transition-[transform,border-color,box-shadow] duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:border-primary/25 motion-safe:hover:shadow-md">
      <Link href={`/products/${id}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        {image && !imageFailed ? (
          <Image src={image} alt={name} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" onError={() => setImageFailed(true)} />
        ) : (
          <span className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-8" />
            <span className="text-xs font-medium">Image unavailable</span>
          </span>
        )}
        <Badge variant="secondary" className="absolute left-3 top-3 bg-card/95 shadow-sm backdrop-blur">{category}</Badge>
        {hasKnownStock && (
          <Badge variant={isOutOfStock ? "destructive" : "default"} className="absolute right-3 top-3 bg-card/95 shadow-sm backdrop-blur">
            {isOutOfStock ? "Out of stock" : "In stock"}
          </Badge>
        )}
      </Link>

      <CardContent className="flex flex-1 flex-col p-5">
        <Link href={`/products/${id}`} className="hover:text-primary">
          <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 transition-colors">{name}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">{description}</p>
        {store && <p className="mt-3 truncate text-xs text-muted-foreground">Sold by <span className="font-medium text-foreground">{store.name}</span></p>}
        <p className="mt-auto pt-4 text-2xl font-bold tracking-tight text-primary">{formatCurrency(price)}</p>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2 border-t bg-muted/30 p-4">
        {hasKnownStock ? (
          <>
            <Button size="sm" onClick={handleAddToCart} disabled={isOutOfStock} className="gap-1.5">
              <ShoppingCart className="size-4" /> {isOutOfStock ? "Unavailable" : "Add to cart"}
            </Button>
            <Link href={`/products/${id}`} className="block">
              <Button size="sm" variant="outline" className="w-full gap-1.5">View details <ArrowRight className="size-3.5" /></Button>
            </Link>
          </>
        ) : (
          <Link href={`/products/${id}`} className="col-span-2 block">
            <Button size="sm" variant="outline" className="w-full gap-1.5">View details <ArrowRight className="size-3.5" /></Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
