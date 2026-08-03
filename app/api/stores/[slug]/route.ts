import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ slug: string }> };

function parsePositiveInteger(value: string | null, fallback: number, maximum?: number) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return maximum ? Math.min(parsed, maximum) : parsed;
}

export async function GET(request: Request, { params }: Context) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parsePositiveInteger(searchParams.get("page"), 1);
    const limit = parsePositiveInteger(searchParams.get("limit"), 12, 48);

    const store = await prisma.store.findFirst({
      where: { slug, status: "APPROVED" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logo: true,
        banner: true,
      },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found." }, { status: 404 });
    }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where: { storeId: store.id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          image: true,
          category: true,
          stock: true,
        },
      }),
      prisma.product.count({ where: { storeId: store.id } }),
    ]);

    return NextResponse.json({
      store,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return NextResponse.json({ message: "Failed to fetch store." }, { status: 500 });
  }
}
