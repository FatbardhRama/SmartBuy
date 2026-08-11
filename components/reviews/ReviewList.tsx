"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquarePlus, Star } from "lucide-react";

import { AddReviewForm } from "./AddReviewForm";
import { EmptyState } from "@/components/ui/empty-state";
import { ReviewsSkeleton } from "./ReviewsSkeleton";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string | null; image: string | null };
};

type ReviewListProps = { productId: string };

export function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.totalReviews || 0);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!productId) {
      return;
    }

    let active = true;

    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        const data = await res.json();

        if (active) {
          setReviews(data.reviews || []);
          setAverageRating(data.averageRating || 0);
          setTotalReviews(data.totalReviews || 0);
        }
      } catch {
        if (active) {
          setReviews([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadReviews();

    return () => {
      active = false;
    };
  }, [productId]);

  if (loading) return <ReviewsSkeleton />;

  return (
    <section className="rounded-[1.75rem] bg-card p-6 ring-1 ring-border/80 sm:p-8 lg:p-10" aria-labelledby="reviews-heading">
      <div className="flex flex-col gap-5 border-b border-border/70 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Customer feedback</p>
          <h2 id="reviews-heading" className="mt-2 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">Reviews</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-warning/10 text-warning"><Star className="size-5 fill-current" aria-hidden="true" /></span>
          <div><p className="text-xl font-bold tabular-nums">{averageRating.toFixed(1)} <span className="text-sm font-medium text-muted-foreground">/ 5</span></p><p className="text-xs text-muted-foreground">{totalReviews} {totalReviews === 1 ? "review" : "reviews"}</p></div>
        </div>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:gap-10">
        {reviews.length === 0 ? (
          <EmptyState icon={<MessageSquarePlus className="size-6" aria-hidden="true" />} title="No reviews yet" description="Be the first to share your experience with this product." className="py-8 shadow-none" />
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => {
              const reviewerName = review.user.name || "Anonymous";
              return (
                <article key={review.id} className="rounded-2xl bg-background p-5 ring-1 ring-border/70">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary" aria-hidden="true">{reviewerName.charAt(0).toUpperCase()}</span>
                      <div><p className="font-semibold">{reviewerName}</p><p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p></div>
                    </div>
                    <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-4 ${index < review.rating ? "fill-warning text-warning" : "text-border"}`} aria-hidden="true" />)}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-foreground/85">{review.comment}</p>
                </article>
              );
            })}
          </div>
        )}

        <AddReviewForm productId={productId} onReviewAdded={() => void fetchReviews()} />
      </div>
    </section>
  );
}
