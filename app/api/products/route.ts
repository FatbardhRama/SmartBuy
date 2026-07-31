import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isNonEmptyString,
  isValidId,
  isValidPositiveNumber,
} from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim() ?? "";
    const category = searchParams.get("category")?.trim() ?? "";

    const products = await prisma.product.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  {
                    name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    category: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {},

          category
            ? {
                category: {
                  equals: category,
                  mode: "insensitive",
                },
              }
            : {},
        ],
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        category: true,
      },
    });

    return NextResponse.json(products);

  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}
export async function POST(req: Request) {
  try {
    let body: Record<string, unknown>;

    try {
      const parsedBody = await req.json();

      if (
        typeof parsedBody !== "object" ||
        parsedBody === null ||
        Array.isArray(parsedBody)
      ) {
        return NextResponse.json(
          { message: "Invalid request body" },
          { status: 400 }
        );
      }

      body = parsedBody as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { name, description, price, image, category } = body;

    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(description) ||
      !isNonEmptyString(image) ||
      !isNonEmptyString(category)
    ) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    if (!isValidPositiveNumber(price)) {
      return NextResponse.json(
        {
          message: "Invalid price",
        },
        {
          status: 400,
        }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        image: image.trim(),
        category: category.trim(),
      },
    });

    return NextResponse.json(product, {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Failed to create product",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    let body: Record<string, unknown>;

    try {
      const parsedBody = await req.json();

      if (
        typeof parsedBody !== "object" ||
        parsedBody === null ||
        Array.isArray(parsedBody)
      ) {
        return NextResponse.json(
          { message: "Invalid request body" },
          { status: 400 }
        );
      }

      body = parsedBody as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { id } = body;

    if (!isNonEmptyString(id) || !isValidId(id)) {
      return NextResponse.json(
        {
          message: "Product id is required",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.product.delete({
      where: {
        id: id.trim(),
      },
    });

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch {
    return NextResponse.json(
      {
        message: "Failed to delete product",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(req: Request) {
  try {
    let body: Record<string, unknown>;

    try {
      const parsedBody = await req.json();

      if (
        typeof parsedBody !== "object" ||
        parsedBody === null ||
        Array.isArray(parsedBody)
      ) {
        return NextResponse.json(
          { message: "Invalid request body" },
          { status: 400 }
        );
      }

      body = parsedBody as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { id, name, description, price, image, category } = body;

    if (!isNonEmptyString(id) || !isValidId(id)) {
      return NextResponse.json(
        {
          message: "Product id is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(description) ||
      !isNonEmptyString(image) ||
      !isNonEmptyString(category)
    ) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    if (!isValidPositiveNumber(price)) {
      return NextResponse.json(
        {
          message: "Invalid price",
        },
        {
          status: 400,
        }
      );
    }

    const product = await prisma.product.update({
      where: {
        id: id.trim(),
      },

      data: {
        name: name.trim(),
        description: description.trim(),
        image: image.trim(),
        category: category.trim(),
        price: Number(price),
      },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      {
        message: "Failed to update product",
      },
      {
        status: 500,
      }
    );
  }
}