import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageOpen } from "lucide-react";

import { ProductCard } from "@/components/products/ProductCard";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";

type StorePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

const PAGE_SIZE = 12;

export default async function StorePage({ params, searchParams }: StorePageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const pageValue = Array.isArray(query.page) ? query.page[0] : query.page;
  const parsedPage = Number(pageValue ?? "1");
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const store = await prisma.store.findFirst({
    where: { slug, status: "APPROVED" },
    select: { id: true, name: true, slug: true, description: true, logo: true, banner: true },
  });

  if (!store) notFound();

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where: { storeId: store.id } }),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <Card className="mb-10 overflow-hidden">
        {store.banner && <div className="relative h-40 w-full sm:h-56"><Image src={store.banner} alt={`${store.name} banner`} fill unoptimized className="object-cover" sizes="100vw" /></div>}
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          {store.logo && <Image src={store.logo} alt={`${store.name} logo`} width={96} height={96} unoptimized className="size-24 rounded-xl border bg-background object-cover" />}
          <div><h1 className="text-3xl font-bold sm:text-4xl">{store.name}</h1>{store.description && <p className="mt-2 max-w-3xl text-muted-foreground">{store.description}</p>}</div>
        </CardContent>
      </Card>

      <section aria-labelledby="store-products-heading">
        <div className="mb-6 flex items-end justify-between gap-4"><div><h2 id="store-products-heading" className="text-2xl font-bold">Products</h2><p className="text-sm text-muted-foreground">{total} {total === 1 ? "product" : "products"}</p></div></div>
        {products.length === 0 ? (
          <EmptyState icon={<PackageOpen className="size-6" />} title="No products available" description="This store has not listed any products yet." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => <ProductCard key={product.id} {...product} store={{ name: store.name, slug: store.slug }} />)}
          </div>
        )}
      </section>

      {totalPages > 1 && <nav className="mt-10 flex justify-center gap-3" aria-label="Store products pagination">
        {page > 1 && <Link href={page === 2 ? `/stores/${store.slug}` : `/stores/${store.slug}?page=${page - 1}`} className="rounded-md border px-4 py-2">Previous</Link>}
        <span className="px-3 py-2 text-sm text-muted-foreground">Page {page} of {totalPages}</span>
        {page < totalPages && <Link href={`/stores/${store.slug}?page=${page + 1}`} className="rounded-md border px-4 py-2">Next</Link>}
      </nav>}
    </main>
  );
}
