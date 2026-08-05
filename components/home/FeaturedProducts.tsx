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
    <section className={tone === "muted" ? "bg-slate-100/65 py-18 dark:bg-slate-900/35 sm:py-24" : "py-18 sm:py-24"}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold text-primary">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-xl leading-7 text-muted-foreground">{description}</p>
          <Link href="/products" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-blue-700 dark:hover:text-blue-300">
            {actionLabel} <ArrowRight className="size-4" />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => <ProductCard key={product.id} {...product} />)}
          </div>
        ) : (
          <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary"><PackageSearch className="size-7" /></span>
            <h3 className="mt-4 text-lg font-semibold">More electronics are on the way</h3>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon for new devices and accessories.</p>
          </div>
        )}
      </div>
    </section>
  );
}
