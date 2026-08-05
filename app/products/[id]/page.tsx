"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, ImageOff, PackageCheck, ShieldCheck, ShoppingCart, Store } from "lucide-react";

import { RelatedProducts } from "@/components/products/RelatedProducts";
import { RecentlyViewedProducts } from "@/components/products/RecentlyViewedProducts";
import { ReviewList } from "@/components/reviews/ReviewList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toastError, toastSuccess } from "@/components/ui/toast";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatCurrency";

type ProductDetails = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  store: { name: string; slug: string; status: string } | null;
};

const RECENTLY_VIEWED_KEY = "recentlyViewed";

function saveRecentlyViewed(product: ProductDetails) {
  try {
    const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const recentlyViewed = saved ? JSON.parse(saved) : [];
    const existingProducts = Array.isArray(recentlyViewed) ? recentlyViewed : [];
    const productToSave = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
    };
    const nextRecentlyViewed = [
      productToSave,
      ...existingProducts.filter((item) => item?.id !== product.id),
    ].slice(0, 4);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(nextRecentlyViewed));
  } catch {
    // Keep the product page usable if localStorage is unavailable.
  }
}

export default function ProductDetailsPage() {
  const { addToCart } = useCart();
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (isMounted) {
          saveRecentlyViewed(data);
          setProduct(data);
        }
      } catch {
        if (isMounted) setProduct(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (id) fetchProduct();
    return () => { isMounted = false; };
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    if (product.stock <= 0) {
      setError("This product is currently out of stock.");
      toastError("This product is currently out of stock.");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: 1,
      stock: product.stock,
    });
    setError("");
    toastSuccess(`${product.name} added to your cart.`);
  }

  if (loading) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-12" aria-busy="true" aria-label="Loading product details">
        <Skeleton className="aspect-square w-full rounded-[1.75rem] lg:min-h-[580px]" />
        <div className="space-y-5 py-4 lg:p-8">
          <div className="flex gap-2"><Skeleton className="h-6 w-24 rounded-lg" /><Skeleton className="h-6 w-20 rounded-lg" /></div>
          <Skeleton className="h-12 w-4/5" /><Skeleton className="h-10 w-36" />
          <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /><Skeleton className="h-20 w-full rounded-xl" />
          <div className="grid gap-3 sm:grid-cols-2"><Skeleton className="h-12 w-full rounded-xl" /><Skeleton className="h-12 w-full rounded-xl" /></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-7xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-[0_16px_40px_-28px_rgba(15,23,42,0.35)]">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><ImageOff className="size-7" /></span>
          <h2 className="mt-4 text-xl font-semibold">Product not available</h2>
          <p className="mt-2 text-sm text-muted-foreground">This product is unavailable right now. Please try another one.</p>
          <Link href="/products"><Button variant="outline" className="mt-6 rounded-xl">Browse products</Button></Link>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-18 px-6 pb-20 pt-10 sm:pb-24 sm:pt-12">
      <Card className="gap-0 overflow-hidden rounded-[1.75rem] border-0 py-0 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.4)] ring-1 ring-border/80">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative aspect-square min-h-80 overflow-hidden bg-muted lg:min-h-[620px]">
            {product.image && !imageFailed ? (
              <Image src={product.image} alt={product.name} fill priority className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02]" sizes="(max-width: 1024px) 100vw, 55vw" onError={() => setImageFailed(true)} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                <ImageOff className="size-12" /><span className="text-sm font-medium">Image unavailable</span>
              </div>
            )}
          </div>

          <CardContent className="flex flex-col p-6 sm:p-8 lg:p-12">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-lg">{product.category}</Badge>
              <Badge variant={inStock ? "default" : "destructive"} className="rounded-lg">{inStock ? "In stock" : "Out of stock"}</Badge>
            </div>
            <h1 className="mt-5 text-3xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-4xl lg:text-[2.75rem]">{product.name}</h1>
            <p className="mt-5 text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-4xl">{formatCurrency(product.price)}</p>
            <p className="mt-6 text-base leading-7 text-muted-foreground">{product.description}</p>

            {product.store?.status === "APPROVED" && (
              <div className="mt-7 rounded-2xl bg-muted/45 p-4 ring-1 ring-border/70">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Store className="size-5" /></span>
                    <div><p className="text-xs font-medium text-muted-foreground">Approved seller</p><p className="font-semibold">{product.store.name}</p></div>
                  </div>
                  <Link href={`/stores/${product.store.slug}`} className="rounded-md text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15">View store</Link>
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <span className="flex items-center gap-2"><PackageCheck className="size-4 text-accent" /> {inStock ? `${product.stock} available` : "Currently unavailable"}</span>
              <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-success" /> Secure SmartBuy checkout</span>
            </div>

            {error && <p className="mt-5 rounded-xl bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p>}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button size="lg" onClick={handleAddToCart} disabled={!inStock} className="h-12 gap-2 rounded-xl">
                {inStock ? <><ShoppingCart className="size-5" /> Add to cart</> : "Out of stock"}
              </Button>
              <WishlistButton productId={product.id} />
            </div>

            <div className="mt-auto border-t border-border/70 pt-6 text-xs text-muted-foreground lg:mt-8">
              <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" /> Product availability is verified during checkout.</span>
            </div>
          </CardContent>
        </div>
      </Card>

      <ReviewList productId={product.id} />
      <RelatedProducts productId={product.id} category={product.category} />
      <RecentlyViewedProducts currentProductId={product.id} />
    </div>
  );
}
