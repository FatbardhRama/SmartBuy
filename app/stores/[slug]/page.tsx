import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck, PackageOpen, Store as StoreIcon } from "lucide-react";

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
      where: { storeId: store.id, store: { is: { status: "APPROVED" } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({
      where: { storeId: store.id, store: { is: { status: "APPROVED" } } },
    }),
  ]);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-10">
      <Link href="/stores" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground outline-none transition-colors hover:text-primary focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"><ArrowLeft className="size-4" aria-hidden="true" /> All stores</Link>
      <Card className="mb-12 overflow-hidden border-0 py-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.55)] ring-1 ring-border">
        {store.banner ? <div className="relative h-44 w-full bg-slate-100 sm:h-60"><Image src={store.banner} alt={`${store.name} banner`} fill unoptimized className="object-cover" sizes="100vw" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 to-transparent" aria-hidden="true" /></div> : <div className="h-28 bg-[linear-gradient(120deg,rgba(37,99,235,0.14),rgba(6,182,212,0.08),rgba(248,250,252,1))] sm:h-36" />}
        <CardContent className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          {store.logo ? <Image src={store.logo} alt={`${store.name} logo`} width={104} height={104} unoptimized className="-mt-16 size-24 rounded-2xl bg-background object-cover shadow-lg ring-4 ring-background sm:-mt-20 sm:size-28" /> : <span className="-mt-16 flex size-24 items-center justify-center rounded-2xl bg-white text-primary shadow-lg ring-4 ring-background sm:-mt-20 sm:size-28"><StoreIcon className="size-10" aria-hidden="true" /></span>}
          <div className="min-w-0 flex-1"><p className="flex items-center gap-1.5 text-sm font-semibold text-success"><BadgeCheck className="size-4" aria-hidden="true" /> Approved SmartBuy seller</p><h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">{store.name}</h1>{store.description && <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{store.description}</p>}</div>
          <div className="self-start rounded-xl bg-muted/60 px-4 py-3 text-center sm:self-center"><p className="text-2xl font-bold text-foreground">{total}</p><p className="text-xs font-medium text-muted-foreground">{total === 1 ? "product" : "products"}</p></div>
        </CardContent>
      </Card>

      <section aria-labelledby="store-products-heading">
        <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-primary">Store catalog</p><h2 id="store-products-heading" className="mt-1 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">Latest products</h2></div><p className="text-sm text-muted-foreground">{total} {total === 1 ? "result" : "results"}</p></div>
        {products.length === 0 ? (
          <EmptyState icon={<PackageOpen className="size-6" />} title="No products available" description="This store has not listed any products yet." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => <ProductCard key={product.id} {...product} store={{ name: store.name, slug: store.slug }} />)}
          </div>
        )}
      </section>

      {totalPages > 1 && <nav className="mt-12 flex items-center justify-center gap-3" aria-label="Store products pagination">
        {page > 1 && <Link href={page === 2 ? `/stores/${store.slug}` : `/stores/${store.slug}?page=${page - 1}`} className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"><ArrowLeft className="size-4" aria-hidden="true" /> Previous</Link>}
        <span className="rounded-xl bg-muted px-4 py-2.5 text-sm font-medium text-muted-foreground">Page {page} of {totalPages}</span>
        {page < totalPages && <Link href={`/stores/${store.slug}?page=${page + 1}`} className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">Next <ArrowRight className="size-4" aria-hidden="true" /></Link>}
      </nav>}
    </main>
  );
}
