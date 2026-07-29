import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

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

    const body: OrderRequest = await request.json();

    if (
      !body.fullName ||
      !body.email ||
      !body.phone ||
      !body.address ||
      !body.city ||
      !body.postalCode ||
      body.items.length === 0
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

    const productIds = body.items.map(
      (item) => item.productId
    );

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== body.items.length) {
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

    const orderItems = body.items.map((item) => {
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

        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        postalCode: body.postalCode,

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