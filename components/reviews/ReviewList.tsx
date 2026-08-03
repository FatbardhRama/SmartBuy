"use client";

import { useEffect, useState } from "react";
import { MessageSquarePlus } from "lucide-react";

import { AddReviewForm } from "./AddReviewForm";
import { EmptyState } from "@/components/ui/empty-state";
import { ReviewsSkeleton } from "./ReviewsSkeleton";


type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
};


type ReviewListProps = {
  productId: string;
};



export function ReviewList({
  productId,
}: ReviewListProps) {


  const [reviews, setReviews] = useState<Review[]>([]);

  const [averageRating, setAverageRating] = useState(0);

  const [totalReviews, setTotalReviews] = useState(0);

  const [loading, setLoading] = useState(true);



  async function fetchReviews() {

    try {

      setLoading(true);


      const res = await fetch(
        `/api/reviews?productId=${productId}`
      );


      const data = await res.json();


      setReviews(data.reviews || []);

      setAverageRating(
        data.averageRating || 0
      );

      setTotalReviews(
        data.totalReviews || 0
      );


    } catch {

      setReviews([]);


    } finally {

      setLoading(false);

    }

  }





  useEffect(() => {

    if (productId) {

      fetchReviews();

    }

  }, [productId]);






  if (loading) {
    return <ReviewsSkeleton />;

  }






  return (

    <div className="mt-8 space-y-6">


      <div>

        <h2 className="text-xl font-semibold">

          Reviews

        </h2>


        <p className="text-sm text-muted-foreground">

          ⭐ {averageRating.toFixed(1)} / 5

          {" "}

          ({totalReviews} reviews)

        </p>


      </div>





      {
        reviews.length === 0 ? (

          <EmptyState
            icon={<MessageSquarePlus className="size-6" aria-hidden="true" />}
            title="No reviews yet"
            description="Be the first to share your experience with this product."
            className="py-7 sm:py-8"
          />

        ) : (


          <div className="space-y-4">

            {
              reviews.map((review) => (

                <div
                  key={review.id}
                  className="rounded-lg border p-4"
                >

                  <div className="flex justify-between">

                    <p className="font-medium">

                      {review.user.name || "Anonymous"}

                    </p>


                    <p>

                      {"⭐".repeat(review.rating)}

                    </p>


                  </div>



                  <p className="mt-2 text-sm">

                    {review.comment}

                  </p>




                  <p className="mt-2 text-xs text-muted-foreground">

                    {
                      new Date(
                        review.createdAt
                      ).toLocaleDateString()
                    }

                  </p>


                </div>

              ))
            }

          </div>


        )
      }




      <AddReviewForm

        productId={productId}

        onReviewAdded={fetchReviews}

      />


    </div>

  );

}
