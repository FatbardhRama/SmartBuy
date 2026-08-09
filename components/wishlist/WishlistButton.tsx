"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  toastError,
  toastSuccess,
} from "@/components/ui/toast";

type WishlistButtonProps = {
  productId: string;
  onWishlistChange?: (isWishlisted: boolean) => void;
  compact?: boolean;
};

export function WishlistButton({
  productId,
  onWishlistChange,
  compact = false,
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
      size={compact ? "icon" : "default"}
      className={compact ? "size-9 rounded-lg border-white/35 bg-white/92 text-slate-700 shadow-[0_10px_24px_-16px_rgba(15,23,42,0.42)] hover:bg-white hover:text-primary" : "h-12 w-full gap-2 rounded-xl"}
      onClick={handleWishlist}
      disabled={loading || status === "loading"}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {!loading && <Heart className={`size-5 ${isWishlisted ? "fill-current" : ""}`} aria-hidden="true" />}
      {!compact && (loading ? "Updating..." : isWishlisted ? "Remove from wishlist" : "Add to wishlist")}
    </Button>
  );
}
