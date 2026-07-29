import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PATCH(
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


    const body = await request.json();


    const order = await prisma.order.update({
      where: {
        id: params.id,
      },

      data: {
        status: body.status,
      },
    });


    return NextResponse.json(order);


  } catch (error) {

    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );


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