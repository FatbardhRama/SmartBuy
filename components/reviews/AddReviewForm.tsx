"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  toastError,
  toastSuccess,
} from "@/components/ui/toast";


type AddReviewFormProps = {
  productId: string;
  onReviewAdded: () => void;
};


export function AddReviewForm({
  productId,
  onReviewAdded,
}: AddReviewFormProps) {

  const { data: session } = useSession();


  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);



  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();


    if (!session) {

      toastError(
        "You must login to write a review."
      );

      return;

    }



    if (!comment.trim()) {

      toastError(
        "Comment cannot be empty."
      );

      return;

    }



    setLoading(true);



    try {

      const res = await fetch(
        "/api/reviews",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            productId,

            rating,

            comment,

          }),

        }
      );



      const data = await res.json();



      if (!res.ok) {

        toastError(
          data.message || "Failed to add review."
        );

        return;

      }



      toastSuccess(
        "Review added successfully."
      );


      setComment("");

      setRating(5);


      onReviewAdded();



    } catch {

      toastError(
        "Something went wrong."
      );


    } finally {

      setLoading(false);

    }

  }





  if (!session) {

    return (

      <div className="rounded-lg border p-4">

        <p className="text-sm text-muted-foreground">

          Please login to write a review.

        </p>

      </div>

    );

  }





  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border p-4"
    >


      <h3 className="font-semibold">

        Write a review

      </h3>




      <div className="flex gap-2">

        {[1,2,3,4,5].map((star) => (

          <button

            key={star}

            type="button"

            onClick={() =>
              setRating(star)
            }

            className="text-2xl"

          >

            {star <= rating ? "⭐" : "☆"}

          </button>

        ))}


      </div>





      <Textarea

        placeholder="Write your comment..."

        value={comment}

        onChange={(e) =>
          setComment(e.target.value)
        }

      />





      <Button
        type="submit"
        disabled={loading}
      >

        {
          loading
            ? "Submitting..."
            : "Submit Review"
        }


      </Button>



    </form>

  );

}