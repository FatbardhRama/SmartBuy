import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";

type DealProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  store: { name: string; slug: string } | null;
};

export function FlashDeals({ products }: { products: DealProduct[] }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-3xl border border-accent/60 bg-accent/20 p-5 sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent-foreground"><Zap className="size-4 fill-current" /> Smart-value tech</p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Today&apos;s deals</h2>
              <p className="mt-3 text-muted-foreground">Discover in-stock electronics at some of the sharpest prices in the marketplace.</p>
            </div>
            <Link href="/deals"><Button variant="outline" className="w-full gap-2 bg-card md:w-auto">Explore all deals <ArrowRight className="size-4" /></Button></Link>
          </div>

          <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => <ProductCard key={product.id} {...product} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
