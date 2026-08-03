"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  toastError,
  toastSuccess,
} from "@/components/ui/toast";

type WishlistButtonProps = {
  productId: string;
  onWishlistChange?: (isWishlisted: boolean) => void;
};

export function WishlistButton({
  productId,
  onWishlistChange,
}: WishlistButtonProps) {
  const { data: session, status } = useSession();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchWishlist() {
      if (!session) {
        setIsWishlisted(false);
        return;
      }

      try {
        const res = await fetch("/api/wishlist");

        if (!res.ok) {
          return;
        }

        const wishlistItems = await res.json();

        setIsWishlisted(
          wishlistItems.some(
            (item: { productId: string }) =>
              item.productId === productId
          )
        );
      } catch {
        setIsWishlisted(false);
      }
    }

    fetchWishlist();
  }, [productId, session]);

  async function handleWishlist() {
    if (status === "loading") {
      return;
    }

    if (!session) {
      toastError("Please login to save products to your wishlist.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/wishlist", {
        method: isWishlisted ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toastError(
          data.message || "Failed to update your wishlist."
        );
        return;
      }

      const nextIsWishlisted = !isWishlisted;

      setIsWishlisted(nextIsWishlisted);
      onWishlistChange?.(nextIsWishlisted);

      toastSuccess(
        nextIsWishlisted
          ? "Product added to your wishlist."
          : "Product removed from your wishlist."
      );
    } catch {
      toastError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant={isWishlisted ? "destructive" : "outline"}
      className="w-full"
      onClick={handleWishlist}
      disabled={loading || status === "loading"}
    >
      {loading
        ? "Updating..."
        : isWishlisted
          ? "Remove from Wishlist"
          : "Add to Wishlist"}
    </Button>
  );
}
