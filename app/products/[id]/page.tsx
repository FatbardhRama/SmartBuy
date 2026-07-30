"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

type ProductDetails = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

export default function ProductDetailsPage() {
  const { addToCart } = useCart();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-center p-10">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center p-10">
        Product not found
      </div>
    );
  }

  function handleAddToCart() {
    if (!product) {
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: 1,
    });
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
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg"
          />

          <p className="text-lg">
            {product.description}
          </p>

          <p className="text-xl font-bold">
            ${product.price}
          </p>

          <p className="text-sm text-muted-foreground">
            Category: {product.category}
          </p>

          <button
            type="button"
            className="w-full bg-green-600 text-white p-4 rounded-lg"
            onClick={handleAddToCart}
          >
            ADD TO CART
          </button>
        </CardContent>
      </Card>
    </div>
  );
}