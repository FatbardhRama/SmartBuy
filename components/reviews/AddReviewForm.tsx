"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toastError, toastSuccess } from "@/components/ui/toast";

type AddReviewFormProps = { productId: string; onReviewAdded: () => void };

export function AddReviewForm({ productId, onReviewAdded }: AddReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      toastError("You must login to write a review.");
      return;
    }
    if (!comment.trim()) {
      toastError("Comment cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        toastError(data.message || "Failed to add review.");
        return;
      }
      toastSuccess("Review added successfully.");
      setComment("");
      setRating(5);
      onReviewAdded();
    } catch {
      toastError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return (
      <div className="self-start rounded-2xl bg-muted/45 p-6 ring-1 ring-border/70">
        <h3 className="font-semibold">Share your experience</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Sign in to rate this product and help other shoppers make an informed choice.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="self-start space-y-5 rounded-2xl bg-muted/35 p-5 ring-1 ring-border/70 sm:p-6">
      <div><h3 className="font-semibold">Write a review</h3><p className="mt-1 text-sm text-muted-foreground">How was your experience with this product?</p></div>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Your rating</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)} className="rounded-lg p-1.5 text-warning transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-warning/20" aria-label={`Rate ${star} out of 5 stars`} aria-pressed={rating === star}>
              <Star className={`size-6 ${star <= rating ? "fill-current" : "text-border"}`} aria-hidden="true" />
            </button>
          ))}
        </div>
      </fieldset>
      <Textarea placeholder="What stood out about this product?" value={comment} onChange={(e) => setComment(e.target.value)} className="min-h-28 rounded-xl bg-card" aria-label="Review comment" />
      <Button type="submit" disabled={loading} className="w-full rounded-xl sm:w-auto">{loading ? "Submitting..." : "Submit review"}</Button>
    </form>
  );
}
