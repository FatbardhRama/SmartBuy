import Link from "next/link";
import { ArrowRight, PackageSearch } from "lucide-react";

import { ProductCard } from "@/components/products/ProductCard";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  store: { name: string; slug: string } | null;
};

type FeaturedProductsProps = {
  products: Product[];
  eyebrow?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  tone?: "default" | "muted";
};

export function FeaturedProducts({
  products,
  eyebrow = "Editor-picked tech",
  title = "Featured electronics",
  description = "Explore standout devices and accessories from approved SmartBuy sellers.",
  actionLabel = "Shop all electronics",
  tone = "default",
}: FeaturedProductsProps) {
  return (
    <section className={tone === "muted" ? "bg-[linear-gradient(180deg,transparent_0%,rgba(239,244,250,0.72)_18%,rgba(239,244,250,0.72)_82%,transparent_100%)] py-18 dark:bg-[linear-gradient(180deg,transparent_0%,rgba(30,41,59,0.42)_18%,rgba(30,41,59,0.42)_82%,transparent_100%)] sm:py-24" : "py-18 sm:py-24"}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="sb-eyebrow">{eyebrow}</p>
            <h2 className="sb-heading-lg">{title}</h2>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">{description}</p>
          </div>
          <Link href="/products" className="group inline-flex w-fit items-center gap-2 rounded-lg text-sm font-semibold text-primary transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15 dark:hover:text-blue-300">
            {actionLabel} <ArrowRight className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => <ProductCard key={product.id} {...product} showWishlistShortcut={false} />)}
          </div>
        ) : (
          <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-card p-8 text-center shadow-[0_20px_50px_-42px_rgba(15,23,42,0.35)]">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary"><PackageSearch className="size-7" /></span>
            <h3 className="mt-4 text-lg font-semibold">More electronics are on the way</h3>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon for new devices and accessories.</p>
          </div>
        )}
      </div>
    </section>
  );
}
