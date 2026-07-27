import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;


    const product = await prisma.product.findUnique({

      where: {
        id,
      },

      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        category: true,
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



  } catch (error) {

    console.error("Error fetching product:", error);


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