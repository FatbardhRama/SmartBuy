import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import {
  isNonEmptyString,
  isValidEmail,
  isValidId,
  isValidPositiveNumber,
} from "@/lib/validation";

type OrderItemRequest = {
  productId: string;
  quantity: number;
};

type OrderRequest = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  items: OrderItemRequest[];
};

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

    const fullName = body.fullName;
    const email = body.email;
    const phone = body.phone;
    const address = body.address;
    const city = body.city;
    const postalCode = body.postalCode;
    const items = body.items;

    if (
      !isNonEmptyString(fullName) ||
      !isNonEmptyString(email) ||
      !isNonEmptyString(phone) ||
      !isNonEmptyString(address) ||
      !isNonEmptyString(city) ||
      !isNonEmptyString(postalCode)
    ) {
      return NextResponse.json(
        {
          message: "Invalid order data.",
        },
        {
          status: 400,
        }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          message: "Invalid email format.",
        },
        {
          status: 400,
        }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          message: "Invalid order data.",
        },
        {
          status: 400,
        }
      );
    }

    const parsedItems: OrderItemRequest[] = [];

    for (const item of items) {
      if (
        typeof item !== "object" ||
        item === null ||
        Array.isArray(item)
      ) {
        return NextResponse.json(
          {
            message: "Invalid order data.",
          },
          {
            status: 400,
          }
        );
      }

      const orderItem = item as Record<string, unknown>;

      if (
        !isNonEmptyString(orderItem.productId) ||
        !isValidId(orderItem.productId)
      ) {
        return NextResponse.json(
          {
            message: "Invalid product id.",
          },
          {
            status: 400,
          }
        );
      }

      if (!isValidPositiveNumber(orderItem.quantity)) {
        return NextResponse.json(
          {
            message: "Invalid quantity.",
          },
          {
            status: 400,
          }
        );
      }

      parsedItems.push({
        productId: orderItem.productId.trim(),
        quantity: Number(orderItem.quantity),
      });
    }

    const productIds = parsedItems.map((item) => item.productId);

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== parsedItems.length) {
      return NextResponse.json(
        {
          message: "One or more products do not exist.",
        },
        {
          status: 404,
        }
      );
    }

    let total = 0;

    const orderItems = parsedItems.map((item) => {
      const product = products.find(
        (product) => product.id === item.productId
      );

      if (!product) {
        throw new Error("Product not found.");
      }

      total += product.price * item.quantity;

      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,

        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),

        total,

        items: {
          create: orderItems,
        },
      },

      include: {
        items: true,
      },
    });

    return NextResponse.json(order, {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Failed to create order.",
      },
      {
        status: 500,
      }
    );
  }
}