import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import {
  isValidId,
  isValidOrderStatus,
} from "@/lib/validation";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await params;

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

    if (!isValidOrderStatus(body.status)) {
      return NextResponse.json(
        {
          message: "Invalid order status",
        },
        {
          status: 400,
        }
      );
    }

    const order = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status: body.status as "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to update order",
      },
      {
        status: 500,
      }
    );
  }
}