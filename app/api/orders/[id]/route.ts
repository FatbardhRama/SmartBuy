import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { isValidId } from "@/lib/validation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!isValidId(id)) {
      return NextResponse.json(
        {
          message: "Invalid order id",
        },
        {
          status: 400,
        }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: session.user.id,
      },

      include: {
        store: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });


    if (!order) {
      return NextResponse.json(
        {
          message: "Order not found",
        },
        {
          status: 404,
        }
      );
    }


    return NextResponse.json(order);

  } catch (error) {

    console.error(
      "GET ORDER DETAILS ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch order",
      },
      {
        status: 500,
      }
    );
  }
}
