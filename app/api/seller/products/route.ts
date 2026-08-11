import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getApprovedSellerStore } from "@/lib/seller";
import { readJsonObject, validateSellerProductBody } from "@/lib/seller-product-validation";

function authorizationError(error: "UNAUTHENTICATED" | "NO_STORE" | "STORE_NOT_APPROVED") {
  if (error === "UNAUTHENTICATED") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    { message: error === "NO_STORE" ? "A seller store is required." : "Your store must be approved." },
    { status: 403 }
  );
}

export async function GET() {
  try {
    const seller = await getApprovedSellerStore();
    if (seller.error) return authorizationError(seller.error);

    const products = await prisma.product.findMany({
      where: { storeId: seller.store.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ message: "Failed to fetch seller products." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const seller = await getApprovedSellerStore();
    if (seller.error) return authorizationError(seller.error);

    const body = await readJsonObject(request);
    if (!body) return NextResponse.json({ message: "Invalid request body." }, { status: 400 });

    const validated = validateSellerProductBody(body);
    if ("message" in validated) {
      return NextResponse.json({ message: validated.message }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        ...(validated.data as {
          name: string;
          description: string;
          price: number;
          category: string;
          image: string;
          stock: number;
        }),
        storeId: seller.store.id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create product." }, { status: 500 });
  }
}
