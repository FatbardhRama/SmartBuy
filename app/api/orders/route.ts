import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isNonEmptyString, isValidEmail, isValidId } from "@/lib/validation";

type OrderItemRequest = { productId: string; quantity: number };

class CheckoutError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: { store: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ message: "Failed to fetch orders." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      const parsed: unknown = await request.json();
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
      }
      body = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const { fullName, email, phone, address, city, postalCode, items } = body;
    if (
      !isNonEmptyString(fullName) || !isNonEmptyString(email) ||
      !isNonEmptyString(phone) || !isNonEmptyString(address) ||
      !isNonEmptyString(city) || !isNonEmptyString(postalCode)
    ) {
      return NextResponse.json({ message: "Invalid order data." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Invalid email format." }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Invalid order data." }, { status: 400 });
    }

    const quantities = new Map<string, number>();
    for (const item of items) {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        return NextResponse.json({ message: "Invalid order data." }, { status: 400 });
      }
      const candidate = item as Record<string, unknown>;
      if (!isNonEmptyString(candidate.productId) || !isValidId(candidate.productId)) {
        return NextResponse.json({ message: "Invalid product id." }, { status: 400 });
      }
      const quantity = Number(candidate.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json({ message: "Invalid quantity." }, { status: 400 });
      }
      const productId = candidate.productId.trim();
      quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
    }

    const parsedItems: OrderItemRequest[] = Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }));
    const products = await prisma.product.findMany({
      where: { id: { in: parsedItems.map((item) => item.productId) } },
      include: { store: true },
    });

    if (products.length !== parsedItems.length) {
      return NextResponse.json({ message: "One or more products do not exist." }, { status: 404 });
    }

    const groups = new Map<string, Array<{ product: (typeof products)[number]; quantity: number }>>();
    for (const item of parsedItems) {
      const product = products.find((candidate) => candidate.id === item.productId)!;
      if (!product.storeId || !product.store || product.store.status !== "APPROVED") {
        return NextResponse.json({ message: `Store unavailable for ${product.name}.` }, { status: 400 });
      }
      const group = groups.get(product.storeId) ?? [];
      group.push({ product, quantity: item.quantity });
      groups.set(product.storeId, group);
    }

    const shipping = {
      fullName: fullName.trim(), email: email.trim(), phone: phone.trim(),
      address: address.trim(), city: city.trim(), postalCode: postalCode.trim(),
    };

    const orders = await prisma.$transaction(async (tx) => {
      for (const item of parsedItems) {
        const product = products.find((candidate) => candidate.id === item.productId)!;
        const updated = await tx.product.updateMany({
          where: { id: product.id, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count !== 1) {
          throw new CheckoutError(`Not enough inventory for ${product.name}`);
        }
      }

      const createdOrders = [];
      for (const [storeId, group] of groups) {
        createdOrders.push(await tx.order.create({
          data: {
            userId: session.user.id,
            storeId,
            ...shipping,
            total: group.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
            items: {
              create: group.map(({ product, quantity }) => ({
                productId: product.id,
                productName: product.name,
                productImage: product.image,
                quantity,
                price: product.price,
              })),
            },
          },
          include: { store: true, items: true },
        }));
      }
      return createdOrders;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    return NextResponse.json({ orders, order: orders[0], orderCount: orders.length }, { status: 201 });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: "Failed to create order." }, { status: 500 });
  }
}
