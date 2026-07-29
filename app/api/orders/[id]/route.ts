import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

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
        id: params.id,
        userId: session.user.id,
      },

      include: {
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