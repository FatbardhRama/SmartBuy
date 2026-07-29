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


    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
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



export async function POST(
  request: Request
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


    const product = await prisma.product.create({

      data: {

        name: body.name,

        description: body.description,

        price: Number(body.price),

        image: body.image,

        category: body.category,

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