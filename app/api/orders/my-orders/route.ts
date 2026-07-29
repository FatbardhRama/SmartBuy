import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
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

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });


    return NextResponse.json(orders);

  } catch (error) {

    console.error("GET ORDERS ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch orders",
      },
      {
        status: 500,
      }
    );
  }
}