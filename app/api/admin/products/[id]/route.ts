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


    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
    });


    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }


    return NextResponse.json(product);


  } catch {

    return NextResponse.json(
      {
        message: "Failed to fetch product",
      },
      {
        status: 500,
      }
    );

  }

}


export async function PUT(
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


    const product = await prisma.product.update({

      where: {
        id: params.id,
      },


      data: {

        name: body.name,

        description: body.description,

        price: Number(body.price),

        image: body.image,

        category: body.category,

      },

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

export async function DELETE(
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


    await prisma.product.delete({
      where: {
        id: params.id,
      },
    });


    return NextResponse.json(
      {
        message: "Product deleted successfully",
      }
    );


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