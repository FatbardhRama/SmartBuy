import { BadgePercent } from "lucide-react";

import { ProductCard } from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function DealsPage() {
  const products = await prisma.product.findMany({
    where: {
      stock: { gt: 0 },
      store: { is: { status: "APPROVED" } },
    },
    orderBy: { price: "asc" },
    take: 8,
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      category: true,
      stock: true,
      store: { select: { name: true, slug: true } },
    },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-12">
      <div className="mb-8 max-w-2xl">
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent-foreground">
          <BadgePercent className="size-4" /> SmartBuy savings
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Today&apos;s electronics deals</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Shop in-stock devices and accessories at some of the best prices from approved SmartBuy sellers.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => <ProductCard key={product.id} {...product} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed bg-muted/40 px-6 py-14 text-center">
          <h2 className="text-xl font-semibold">No in-stock deals right now</h2>
          <p className="mt-2 text-muted-foreground">Check back as approved electronics sellers update their inventory.</p>
        </div>
      )}
    </main>
  );
}
