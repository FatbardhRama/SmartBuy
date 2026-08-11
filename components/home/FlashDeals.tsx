import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

import { ProductCard } from "@/components/products/ProductCard";

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
    <section className="pb-18 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#F8FCFF_0%,#ECFEFF_54%,#EFF6FF_100%)] p-5 shadow-[0_28px_76px_-52px_rgba(8,145,178,0.58)] ring-1 ring-cyan-200/70 dark:bg-[linear-gradient(135deg,#172033_0%,#111C2F_58%,#0F1B2C_100%)] dark:shadow-[0_28px_76px_-52px_rgba(2,6,23,0.7)] dark:ring-slate-700/80 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-accent/12 blur-xl dark:bg-cyan-400/5" />
          <div className="relative mb-9 max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300"><Zap className="size-4 fill-current" /> Smart-value tech</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">Today&apos;s best-value picks</h2>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">In-stock electronics at some of the sharpest prices across the SmartBuy marketplace.</p>
            <Link href="/deals" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-blue-700 dark:hover:text-blue-300">
              Explore all deals <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="relative grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => <ProductCard key={product.id} {...product} showWishlistShortcut={false} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
