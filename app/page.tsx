import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FlashDeals } from "@/components/home/FlashDeals";
import { HeroSection } from "@/components/home/HeroSection";
import { Newsletter } from "@/components/home/Newsletter";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const availableProducts = {
    store: { is: { status: "APPROVED" as const } },
    stock: { gt: 0 },
  };
  const productCardFields = {
    id: true,
    name: true,
    description: true,
    price: true,
    image: true,
    category: true,
    stock: true,
    store: { select: { name: true, slug: true } },
  };

  const [featuredProducts, dealProducts, newArrivals, bestSellers] = await Promise.all([
    prisma.product.findMany({ where: availableProducts, orderBy: { price: "desc" }, take: 4, select: productCardFields }),
    prisma.product.findMany({ where: availableProducts, orderBy: { price: "asc" }, take: 4, select: productCardFields }),
    prisma.product.findMany({ where: availableProducts, orderBy: { createdAt: "desc" }, take: 4, select: productCardFields }),
    prisma.product.findMany({ where: availableProducts, orderBy: { orderItems: { _count: "desc" } }, take: 4, select: productCardFields }),
  ]);

  return (
    <div className="overflow-hidden bg-background">
      <HeroSection />
      <Categories />
      <FlashDeals products={dealProducts} />
      <FeaturedProducts products={featuredProducts} tone="muted" />
      <FeaturedProducts
        products={newArrivals}
        eyebrow="Just landed"
        title="New arrivals"
        description="Meet the newest in-stock electronics from trusted SmartBuy sellers."
        actionLabel="Browse new tech"
      />
      <FeaturedProducts
        products={bestSellers}
        eyebrow="Popular with shoppers"
        title="Best sellers"
        description="Shop electronics customers are choosing across the SmartBuy marketplace."
        actionLabel="Shop popular picks"
        tone="muted"
      />
      <Newsletter />
    </div>
  );
}
