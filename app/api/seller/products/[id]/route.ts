import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getApprovedSellerStore } from "@/lib/seller";
import { readJsonObject, validateSellerProductBody } from "@/lib/seller-product-validation";
import { isValidId } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

function authorizationError(error: "UNAUTHENTICATED" | "NO_STORE" | "STORE_NOT_APPROVED") {
  if (error === "UNAUTHENTICATED") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    { message: error === "NO_STORE" ? "A seller store is required." : "Your store must be approved." },
    { status: 403 }
  );
}

async function authorizeProduct(id: string) {
  const seller = await getApprovedSellerStore();
  if (seller.error) return { response: authorizationError(seller.error), store: null, product: null };
  if (!isValidId(id)) {
    return { response: NextResponse.json({ message: "Invalid product id." }, { status: 400 }), store: null, product: null };
  }

  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) {
    return { response: NextResponse.json({ message: "Product not found." }, { status: 404 }), store: null, product: null };
  }
  if (product.storeId !== seller.store.id) {
    return { response: NextResponse.json({ message: "Forbidden" }, { status: 403 }), store: null, product: null };
  }

  return { response: null, store: seller.store, product };
}

export async function GET(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const authorized = await authorizeProduct(id);
    if (authorized.response) return authorized.response;
    return NextResponse.json(authorized.product);
  } catch {
    return NextResponse.json({ message: "Failed to fetch product." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const authorized = await authorizeProduct(id);
    if (authorized.response) return authorized.response;

    const body = await readJsonObject(request);
    if (!body) return NextResponse.json({ message: "Invalid request body." }, { status: 400 });

    const validated = validateSellerProductBody(body, true);
    if ("message" in validated) {
      return NextResponse.json({ message: validated.message }, { status: 400 });
    }

    const result = await prisma.product.updateMany({
      where: { id, storeId: authorized.store!.id },
      data: validated.data,
    });
    if (result.count !== 1) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    const product = await prisma.product.findFirst({
      where: { id, storeId: authorized.store!.id },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ message: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const authorized = await authorizeProduct(id);
    if (authorized.response) return authorized.response;

    const result = await prisma.product.deleteMany({
      where: { id, storeId: authorized.store!.id },
    });
    if (result.count !== 1) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully." });
  } catch {
    return NextResponse.json(
      { message: "This product could not be deleted. It may be referenced by an existing order." },
      { status: 409 }
    );
  }
}
