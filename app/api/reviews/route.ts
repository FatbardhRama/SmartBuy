import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        {
          message: "Product id is required.",
        },
        {
          status: 400,
        }
      );
    }


    const reviews = await prisma.review.findMany({
      where: {
        productId,
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


    const body = await request.json();


    const {
      productId,
      rating,
      comment,
    } = body;



    if (
      !productId ||
      !rating ||
      !comment
    ) {
      return NextResponse.json(
        {
          message: "Invalid review data.",
        },
        {
          status: 400,
        }
      );
    }



    if (
      rating < 1 ||
      rating > 5
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



    const product = await prisma.product.findUnique({
      where: {
        id: productId,
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
            productId,
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
          productId,
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
        rating: Number(rating),
        comment: comment.trim(),

        userId: session.user.id,

        productId,
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