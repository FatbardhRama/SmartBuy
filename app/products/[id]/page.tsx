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
      <div className="mx-auto grid min-h-[60vh] max-w-7xl gap-8 px-6 py-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="space-y-5 py-4">
          <Skeleton className="h-6 w-28" /><Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-8 w-36" /><Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-7xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-dashed bg-card p-8 text-center shadow-sm">
          <ImageOff className="mx-auto size-9 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Product not available</h2>
          <p className="mt-2 text-sm text-muted-foreground">This product is unavailable right now. Please try another one.</p>
          <Link href="/products"><Button variant="outline" className="mt-6">Browse products</Button></Link>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-14 px-6 py-10 sm:py-12">
      <Card className="gap-0 overflow-hidden py-0">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative aspect-square min-h-80 overflow-hidden bg-muted lg:min-h-[580px]">
            {product.image && !imageFailed ? (
              <Image src={product.image} alt={product.name} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" onError={() => setImageFailed(true)} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                <ImageOff className="size-12" /><span className="text-sm font-medium">Image unavailable</span>
              </div>
            )}
          </div>

          <CardContent className="flex flex-col p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant={inStock ? "default" : "destructive"}>{inStock ? "In stock" : "Out of stock"}</Badge>
            </div>
            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h1>
            <p className="mt-5 text-3xl font-bold tracking-tight text-primary sm:text-4xl">{formatCurrency(product.price)}</p>
            <p className="mt-6 text-base leading-7 text-muted-foreground">{product.description}</p>

            {product.store?.status === "APPROVED" && (
              <div className="mt-7 rounded-xl border bg-muted/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Store className="size-5" /></span>
                    <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sold by</p><p className="font-semibold">{product.store.name}</p></div>
                  </div>
                  <Link href={`/stores/${product.store.slug}`} className="text-sm font-semibold text-primary hover:underline">View Store</Link>
                </div>
              </div>
            )}

            <div className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <span className="flex items-center gap-2"><PackageCheck className="size-4 text-primary" /> {inStock ? `${product.stock} available` : "Currently unavailable"}</span>
              <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Secure SmartBuy checkout</span>
            </div>

            {error && <p className="mt-5 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button size="lg" onClick={handleAddToCart} disabled={!inStock} className="gap-2">
                {inStock ? <><ShoppingCart className="size-5" /> Add to cart</> : "Out of stock"}
              </Button>
              <WishlistButton productId={product.id} />
            </div>

            <div className="mt-auto pt-8 text-xs text-muted-foreground">
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
