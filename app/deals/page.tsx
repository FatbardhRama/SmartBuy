import Link from "next/link";
import { ArrowRight, BadgePercent, PackageSearch, ShieldCheck, Sparkles } from "lucide-react";

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
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 sm:pb-24 sm:pt-12">
      <section className="relative mb-10 overflow-hidden rounded-2xl bg-slate-950 px-6 py-9 text-white shadow-[0_24px_70px_-42px_rgba(15,23,42,0.9)] sm:px-10 sm:py-12">
        <div className="absolute -right-20 -top-28 size-72 rounded-full bg-cyan-400/15 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 left-1/3 size-72 rounded-full bg-blue-600/25 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-semibold text-cyan-300"><BadgePercent className="size-4" aria-hidden="true" /> SmartBuy savings</p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Better tech, smarter prices.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">Discover in-stock devices and accessories at standout prices from approved marketplace sellers.</p>
          </div>
          <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2 lg:grid-cols-1">
            <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3"><ShieldCheck className="size-4 text-cyan-300" aria-hidden="true" /> Approved sellers</span>
            <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3"><Sparkles className="size-4 text-cyan-300" aria-hidden="true" /> In-stock picks</span>
          </div>
        </div>
      </section>
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold text-primary">Curated offers</p><h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">Today&apos;s featured deals</h2></div>
        <Link href="/products" className="group inline-flex items-center gap-2 text-sm font-semibold text-primary outline-none transition-colors hover:text-primary/80 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">Browse all products <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></Link>
      </div>

      {products.length > 0 ? (
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => <ProductCard key={product.id} {...product} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><PackageSearch className="size-6" aria-hidden="true" /></span>
          <h2 className="mt-5 text-xl font-semibold">No in-stock deals right now</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">Check back soon as approved electronics sellers update their inventory and pricing.</p>
          <Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">Explore the catalog <ArrowRight className="size-4" aria-hidden="true" /></Link>
        </div>
      )}
    </main>
  );
}
