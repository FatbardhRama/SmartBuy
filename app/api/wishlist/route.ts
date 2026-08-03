import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { isNonEmptyString, isValidId } from "@/lib/validation";

export async function GET() {
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

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        userId: session.user.id,
      },

      include: {
        product: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(wishlistItems);
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch wishlist items.",
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

    const productId = body.productId;

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

    const product = await prisma.product.findUnique({
      where: {
        id: productId.trim(),
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

    const existingWishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product.id,
        },
      },
    });

    if (existingWishlistItem) {
      return NextResponse.json(
        {
          message: "Product is already in your wishlist.",
        },
        {
          status: 400,
        }
      );
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId: product.id,
      },

      include: {
        product: true,
      },
    });

    return NextResponse.json(wishlistItem, {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Failed to add product to wishlist.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: Request) {
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

    const productId = body.productId;

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

    const result = await prisma.wishlistItem.deleteMany({
      where: {
        userId: session.user.id,
        productId: productId.trim(),
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          message: "Wishlist item not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      message: "Product removed from wishlist.",
    });
  } catch {
    return NextResponse.json(
      {
        message: "Failed to remove product from wishlist.",
      },
      {
        status: 500,
      }
    );
  }
}
