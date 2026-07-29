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



    const users = await prisma.user.count();


    const products = await prisma.product.count();


    const orders = await prisma.order.count();



    const revenue = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });



    const recentOrders = await prisma.order.findMany({

      take: 5,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },

    });



    return NextResponse.json({

      users,

      products,

      orders,

      revenue:
        revenue._sum.total || 0,

      recentOrders,

    });



  } catch {

    return NextResponse.json(
      {
        message: "Dashboard error",
      },
      {
        status: 500,
      }
    );

  }

}