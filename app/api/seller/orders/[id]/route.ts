import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getApprovedSellerStore } from "@/lib/seller";
import { isValidId } from "@/lib/validation";

const allowedStatuses = new Set(["PROCESSING", "SHIPPED", "DELIVERED"]);
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  try {
    const seller = await getApprovedSellerStore();
    if (seller.error === "UNAUTHENTICATED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (seller.error) {
      return NextResponse.json({ message: "An approved seller store is required." }, { status: 403 });
    }

    const { id } = await params;
    if (!isValidId(id)) {
      return NextResponse.json({ message: "Invalid order id." }, { status: 400 });
    }

    let body: unknown;
    try { body = await request.json(); } catch { body = null; }
    const status = typeof body === "object" && body !== null && !Array.isArray(body)
      ? (body as Record<string, unknown>).status
      : null;
    if (typeof status !== "string" || !allowedStatuses.has(status)) {
      return NextResponse.json({ message: "Invalid seller order status." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id }, select: { storeId: true, status: true } });
    if (!order) return NextResponse.json({ message: "Order not found." }, { status: 404 });
    if (order.storeId !== seller.store.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    if (order.status === "CANCELLED" || order.status === "DELIVERED") {
      return NextResponse.json({ message: "This order status can no longer be changed by the seller." }, { status: 409 });
    }

    const updated = await prisma.order.updateMany({
      where: { id, storeId: seller.store.id },
      data: { status: status as "PROCESSING" | "SHIPPED" | "DELIVERED" },
    });
    if (updated.count !== 1) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    return NextResponse.json(await prisma.order.findUnique({ where: { id } }));
  } catch {
    return NextResponse.json({ message: "Failed to update order status." }, { status: 500 });
  }
}
