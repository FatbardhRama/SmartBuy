import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { isNonEmptyString, isValidId } from "@/lib/validation";


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const productId = searchParams.get("productId");

    if (!isNonEmptyString(productId) || !isValidId(productId)) {
      return NextResponse.json(
        {
          message: "Invalid product id.",
        },
        {
          status: 400,
        }
      );
    }


    const reviews = await prisma.review.findMany({
      where: {
        productId: productId.trim(),
      },

      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });


    const totalReviews = reviews.length;


    const averageRating =
      totalReviews === 0
        ? 0
        :
        reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / totalReviews;


    return NextResponse.json({
      reviews,
      totalReviews,
      averageRating,
    });


  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch reviews.",
      },
      {
        status: 500,
      }
    );
  }
}



export async function POST(request: Request) {
  try {

    const session = await getServerSession(authOptions);


    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }


    let body: Record<string, unknown>;

    try {
      const parsedBody = await request.json();

      if (
        typeof parsedBody !== "object" ||
        parsedBody === null ||
        Array.isArray(parsedBody)
      ) {
        return NextResponse.json(
          {
            message: "Invalid request body.",
          },
          {
            status: 400,
          }
        );
      }

      body = parsedBody as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        {
          message: "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }


    const {
      productId,
      rating,
      comment,
    } = body;



    if (!isNonEmptyString(productId) || !isValidId(productId)) {
      return NextResponse.json(
        {
          message: "Invalid product id.",
        },
        {
          status: 400,
        }
      );
    }

    const parsedRating =
      typeof rating === "number"
        ? rating
        : typeof rating === "string" && rating.trim() !== ""
          ? Number(rating)
          : Number.NaN;



    if (
      !Number.isInteger(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      return NextResponse.json(
        {
          message: "Rating must be between 1 and 5.",
        },
        {
          status: 400,
        }
      );
    }

    if (!isNonEmptyString(comment)) {
      return NextResponse.json(
        {
          message: "Comment cannot be empty.",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedProductId = productId.trim();
    const normalizedComment = comment.trim();



    const product = await prisma.product.findUnique({
      where: {
        id: normalizedProductId,
      },
    });



    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found.",
        },
        {
          status: 404,
        }
      );
    }



    const purchased = await prisma.order.findFirst({
      where: {
        userId: session.user.id,

        status: "DELIVERED",

        items: {
          some: {
            productId: normalizedProductId,
          },
        },
      },
    });



    if (!purchased) {
      return NextResponse.json(
        {
          message:
            "You can review only products you purchased.",
        },
        {
          status: 403,
        }
      );
    }



    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: normalizedProductId,
        },
      },
    });



    if (existingReview) {
      return NextResponse.json(
        {
          message:
            "You already reviewed this product.",
        },
        {
          status: 400,
        }
      );
    }



    const review = await prisma.review.create({
      data: {
        rating: parsedRating,
        comment: normalizedComment,

        userId: session.user.id,

        productId: normalizedProductId,
      },

      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });



    return NextResponse.json(
      review,
      {
        status: 201,
      }
    );


  } catch {

    return NextResponse.json(
      {
        message: "Failed to create review.",
      },
      {
        status: 500,
      }
    );

  }
}
