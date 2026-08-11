"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ImageOff, ShoppingCart, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toastSuccess } from "@/components/ui/toast";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatCurrency";
import { WishlistButton } from "@/components/wishlist/WishlistButton";

type ProductProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
  store?: { name: string; slug: string } | null;
  isWishlisted?: boolean;
  onWishlistChange?: (isWishlisted: boolean) => void;
  showWishlistShortcut?: boolean;
};

export function ProductCard({ id, name, description, price, image, category, stock, store, isWishlisted, onWishlistChange, showWishlistShortcut = true }: ProductProps) {
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
    <Card className="group relative h-full gap-0 overflow-hidden rounded-[1.35rem] border-0 py-0 ring-1 ring-border/80 transition-[transform,box-shadow,ring-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_28px_60px_-32px_rgba(37,99,235,0.38)] motion-safe:hover:ring-primary/20">
      <Link href={`/products/${id}`} className="relative block aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#FFFFFF_0%,#EFF6FF_48%,#E2E8F0_100%)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-primary/25 dark:bg-[radial-gradient(circle_at_50%_0%,#334155_0%,#172033_58%,#0F172A_100%)]">
        {image && !imageFailed ? (
          <Image src={image} alt={name} fill className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.035]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" onError={() => setImageFailed(true)} />
        ) : (
          <span className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-8" />
            <span className="text-xs font-medium">Image unavailable</span>
          </span>
        )}
        <Badge variant="secondary" className="absolute left-3 top-3 bg-card/95 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">{category}</Badge>
        {hasKnownStock && (
          <Badge variant={isOutOfStock ? "destructive" : "default"} className="absolute right-3 top-3 bg-card/95 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
            {isOutOfStock ? "Out of stock" : "In stock"}
          </Badge>
        )}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/20 to-transparent" />
      </Link>

      {showWishlistShortcut && <div className="absolute right-3 top-14 z-10">
        <WishlistButton productId={id} compact initialIsWishlisted={isWishlisted} onWishlistChange={onWishlistChange} />
      </div>}

      <CardContent className="flex flex-1 flex-col p-5 sm:p-5">
        <Link href={`/products/${id}`} className="rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15">
          <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 tracking-tight transition-colors">{name}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">{description}</p>
        {store && <p className="mt-3 flex min-w-0 items-center gap-1.5 truncate text-xs text-muted-foreground"><Store className="size-3.5 shrink-0 text-primary" aria-hidden="true" /> Sold by <span className="truncate font-medium text-foreground">{store.name}</span></p>}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="text-2xl font-bold tracking-[-0.035em] text-secondary dark:text-foreground">{formatCurrency(price)}</p>
          {hasKnownStock && !isOutOfStock && <span className="shrink-0 text-xs font-medium text-success">Ready to ship</span>}
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2 border-t border-border/70 bg-muted/30 p-4">
        {hasKnownStock ? (
          <>
            <Button size="sm" onClick={handleAddToCart} disabled={isOutOfStock} className="gap-1.5 rounded-lg">
              <ShoppingCart className="size-4" /> {isOutOfStock ? "Unavailable" : "Add to cart"}
            </Button>
            <Link href={`/products/${id}`} className="block">
              <Button size="sm" variant="outline" className="w-full gap-1.5 rounded-lg">Details <ArrowRight className="size-3.5" /></Button>
            </Link>
          </>
        ) : (
          <Link href={`/products/${id}`} className="col-span-2 block">
            <Button size="sm" variant="outline" className="w-full gap-1.5 rounded-lg">View details <ArrowRight className="size-3.5" /></Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
