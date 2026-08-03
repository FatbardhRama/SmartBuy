"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatCurrency";
import { toastError, toastSuccess } from "@/components/ui/toast";

import { ReviewList } from "@/components/reviews/ReviewList";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { RecentlyViewedProducts } from "@/components/products/RecentlyViewedProducts";


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

    const recentlyViewed = saved
      ? JSON.parse(saved)
      : [];

    const existingProducts = Array.isArray(recentlyViewed)
      ? recentlyViewed
      : [];

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
      ...existingProducts.filter(
        (item) => item?.id !== product.id
      ),
    ].slice(0, 4);

    localStorage.setItem(
      RECENTLY_VIEWED_KEY,
      JSON.stringify(nextRecentlyViewed)
    );
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

        if (isMounted) {

          setProduct(null);

        }


      } finally {

        if (isMounted) {

          setLoading(false);

        }

      }

    }


    if (id) {

      fetchProduct();

    }


    return () => {

      isMounted = false;

    };


  }, [id]);





  if (loading) {

    return (

      <div className="flex min-h-[50vh] items-center justify-center px-4 py-12 sm:px-6 sm:py-16">

        <div className="flex flex-col items-center gap-3 text-center">

          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />

          <p className="text-sm text-muted-foreground">
            Loading product...
          </p>

        </div>

      </div>

    );

  }





  if (!product) {

    return (

      <div className="flex min-h-[50vh] items-center justify-center px-4 py-12 sm:px-6 sm:py-16">

        <div className="w-full max-w-md rounded-lg border border-dashed p-6 text-center sm:p-8">

          <h2 className="text-xl font-semibold">
            Product not available
          </h2>


          <p className="mt-2 text-sm text-muted-foreground">
            This product is unavailable right now. Please try another one.
          </p>


        </div>

      </div>

    );

  }







  function handleAddToCart() {

    if (!product) {

      return;

    }



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






  return (

    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">

      <div className="mx-auto max-w-6xl space-y-12">

      <Card className="mx-auto w-full max-w-xl motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2">


        <CardHeader>

          <CardTitle className="break-words text-xl sm:text-2xl">

            {product.name}

          </CardTitle>

        </CardHeader>





        <CardContent className="space-y-4">


          <div className="relative h-56 w-full overflow-hidden rounded-lg sm:h-64">

            <Image

              src={product.image}

              alt={product.name}

              fill

              className="object-cover"

              sizes="(max-width: 768px) 100vw, 50vw"

            />

          </div>





          <p className="break-words text-base sm:text-lg">

            {product.description}

          </p>





          <p className="text-xl font-bold">

            {formatCurrency(product.price)}

          </p>





          <p className="text-sm text-muted-foreground">

            Category: {product.category}

          </p>

          {product.store?.status === "APPROVED" && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sold by</p>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold">{product.store.name}</p>
                <Link href={`/stores/${product.store.slug}`} className="text-sm font-medium text-primary underline-offset-4 hover:underline">View Store</Link>
              </div>
            </div>
          )}





          <p
            className={`font-medium ${
              product.stock > 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >

            {
              product.stock > 0
                ? `In Stock: ${product.stock} available`
                : "Out of Stock"
            }

          </p>





          {error && (

            <p className="text-sm text-red-500">

              {error}

            </p>

          )}






          <div className="grid gap-3 sm:grid-cols-2">
            <button

              type="button"

              className="min-h-12 w-full rounded-lg bg-green-600 p-4 text-white disabled:bg-gray-400"

              onClick={handleAddToCart}

              disabled={product.stock <= 0}

            >

              {
                product.stock > 0
                  ? "ADD TO CART"
                  : "OUT OF STOCK"
              }


            </button>

            <WishlistButton productId={product.id} />
          </div>





          <ReviewList productId={product.id} />



        </CardContent>


      </Card>

      <RelatedProducts
        productId={product.id}
        category={product.category}
      />

      <RecentlyViewedProducts
        currentProductId={product.id}
      />


    </div>

    </div>

  );

}
