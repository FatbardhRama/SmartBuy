import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getApprovedSellerStore } from "@/lib/seller";
import {
  isNonEmptyString,
  isValidId,
  isValidNonNegativeInteger,
  isValidPositiveNumber,
} from "@/lib/validation";

function sellerAuthorizationError(
  error: "UNAUTHENTICATED" | "NO_STORE" | "STORE_NOT_APPROVED"
) {
  if (error === "UNAUTHENTICATED") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { message: "An approved seller store is required." },
    { status: 403 }
  );
}

async function authorizeSellerProduct(id: string) {
  const seller = await getApprovedSellerStore();

  if (seller.error) {
    return {
      response: sellerAuthorizationError(seller.error),
      store: null,
    };
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: { storeId: true },
  });

  if (!product) {
    return {
      response: NextResponse.json({ message: "Product not found" }, { status: 404 }),
      store: null,
    };
  }

  if (product.storeId !== seller.store.id) {
    return {
      response: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
      store: null,
    };
  }

  return { response: null, store: seller.store };
}


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);


    const search = searchParams.get("search")?.trim() ?? "";

    const category = searchParams.get("category")?.trim() ?? "";

    const requestedIds = searchParams.getAll("id");
    const productIds = requestedIds
      .filter((id) => isValidId(id))
      .slice(0, 20);


    const page = Number(
      searchParams.get("page") ?? "1"
    );


    const limit = Number(
      searchParams.get("limit") ?? "12"
    );


    const sort = searchParams.get("sort") ?? "newest";


    const orderBy: Record<string, "asc" | "desc"> = {};

    switch (sort) {
      case "price-low":
        orderBy.price = "asc";
        break;

      case "price-high":
        orderBy.price = "desc";
        break;

      case "name-a":
        orderBy.name = "asc";
        break;

      case "name-z":
        orderBy.name = "desc";
        break;

      default:
        orderBy.createdAt = "desc";
    }


    const where = {
      AND: [
        {
          store: {
            is: {
              status: "APPROVED" as const,
            },
          },
        },
        requestedIds.length > 0
          ? {
              id: {
                in: productIds,
              },
            }
          : {},
        search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
                {
                  category: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {},


        category && category !== "All"
          ? {
              category: {
                equals: category,
                mode: "insensitive" as const,
              },
            }
          : {},
      ],
    };


    const products = await prisma.product.findMany({

      where,


      orderBy,


      skip: (page - 1) * limit,


      take: limit,


      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        category: true,
        stock: true,
        store: {
          select: {
            name: true,
            slug: true,
            status: true,
          },
        },
      },

    });



    const total = await prisma.product.count({
      where,
    });



    return NextResponse.json({

      products: products.map((product) => ({
        ...product,
        store: product.store?.status === "APPROVED"
          ? { name: product.store.name, slug: product.store.slug }
          : null,
      })),

      total,

      page,

      totalPages: Math.ceil(
        total / limit
      ),

    });


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
    const seller = await getApprovedSellerStore();
    if (seller.error) return sellerAuthorizationError(seller.error);

    let body: Record<string, unknown>;

    try {
      const parsedBody = await req.json();

      if (
        typeof parsedBody !== "object" ||
        parsedBody === null ||
        Array.isArray(parsedBody)
      ) {
        return NextResponse.json(
          {
            message: "Invalid request body",
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
          message: "Invalid request body",
        },
        {
          status: 400,
        }
      );

    }


    const {
      name,
      description,
      price,
      image,
      category,
      stock,
    } = body;



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

    if (stock !== undefined && !isValidNonNegativeInteger(stock)) {
      return NextResponse.json(
        {
          message: "Invalid stock value",
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
        stock: stock === undefined ? 0 : Number(stock),
        storeId: seller.store.id,
      },

    });



    return NextResponse.json(
      product,
      {
        status: 201,
      }
    );


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

    const body = await req.json();


    const { id } = body;


    if (
      !isNonEmptyString(id) ||
      !isValidId(id)
    ) {

      return NextResponse.json(
        {
          message: "Product id is required",
        },
        {
          status: 400,
        }
      );

    }

    const productId = id.trim();
    const authorized = await authorizeSellerProduct(productId);
    if (authorized.response) return authorized.response;

    const deleted = await prisma.product.deleteMany({
      where: { id: productId, storeId: authorized.store!.id },
    });

    if (deleted.count !== 1) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }



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

    const body = await req.json();


    const {
      id,
      name,
      description,
      price,
      image,
      category,
    } = body;



    if (
      !isNonEmptyString(id) ||
      !isValidId(id)
    ) {

      return NextResponse.json(
        {
          message: "Product id is required",
        },
        {
          status: 400,
        }
      );

    }

    const productId = id.trim();
    const authorized = await authorizeSellerProduct(productId);
    if (authorized.response) return authorized.response;

    const updated = await prisma.product.updateMany({
      where: { id: productId, storeId: authorized.store!.id },
      data: {
        name,
        description,
        price: Number(price),
        image,
        category,
      },
    });

    if (updated.count !== 1) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, storeId: authorized.store!.id },
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
