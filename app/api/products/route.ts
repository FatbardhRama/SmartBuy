import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {

    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });


    return NextResponse.json(products);

  } catch (error) {
    console.error("Error fetching products:", error);

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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      description,
      price,
      image,
      category,
    } = body;


    if (!name || !description || !price || !image || !category) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }


    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        image,
        category,
      },
    });


    return NextResponse.json(
      product,
      {
        status: 201,
      }
    );


  } catch (error) {

    console.error("Error creating product:", error);
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

export async function DELETE(req: Request) {
  try {

    const { id } = await req.json();


    if (!id) {
      return NextResponse.json(
        {
          message: "Product id is required",
        },
        {
          status: 400,
        }
      );
    }


    await prisma.product.delete({
      where: {
        id,
      },
    });


    return NextResponse.json({
      message: "Product deleted successfully",
    });


  } catch (error) {

    console.error("Error deleting product:", error);
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