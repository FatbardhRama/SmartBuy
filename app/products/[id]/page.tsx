"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatCurrency";
import { toastError, toastSuccess } from "@/components/ui/toast";

import { ReviewList } from "@/components/reviews/ReviewList";


type ProductDetails = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
};


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

      <div className="flex min-h-[50vh] items-center justify-center px-6 py-16">

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

      <div className="flex min-h-[50vh] items-center justify-center px-6 py-16">

        <div className="rounded-lg border border-dashed p-8 text-center">

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

    <div className="min-h-screen flex items-center justify-center p-6">

      <Card className="w-full max-w-xl">


        <CardHeader>

          <CardTitle className="text-2xl">

            {product.name}

          </CardTitle>

        </CardHeader>





        <CardContent className="space-y-4">


          <div className="relative h-64 w-full overflow-hidden rounded-lg">

            <Image

              src={product.image}

              alt={product.name}

              fill

              className="object-cover"

              sizes="(max-width: 768px) 100vw, 50vw"

            />

          </div>





          <p className="text-lg">

            {product.description}

          </p>





          <p className="text-xl font-bold">

            {formatCurrency(product.price)}

          </p>





          <p className="text-sm text-muted-foreground">

            Category: {product.category}

          </p>





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






          <button

            type="button"

            className="w-full bg-green-600 text-white p-4 rounded-lg disabled:bg-gray-400"

            onClick={handleAddToCart}

            disabled={product.stock <= 0}

          >

            {
              product.stock > 0
                ? "ADD TO CART"
                : "OUT OF STOCK"
            }


          </button>





          <ReviewList productId={product.id} />



        </CardContent>


      </Card>


    </div>

  );

}