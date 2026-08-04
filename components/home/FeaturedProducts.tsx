import Link from "next/link";
import { ArrowRight, PackageSearch } from "lucide-react";

import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";

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
    <section className={tone === "muted" ? "border-y border-border/70 bg-card py-14 sm:py-18" : "py-14 sm:py-18"}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h2>
            <p className="mt-3 text-muted-foreground">{description}</p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="w-full gap-2 sm:w-auto">
              {actionLabel} <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => <ProductCard key={product.id} {...product} />)}
          </div>
        ) : (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/40 p-8 text-center">
            <PackageSearch className="size-9 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">More electronics are on the way</h3>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon for new devices and accessories.</p>
          </div>
        )}
      </div>
    </section>
  );
}
