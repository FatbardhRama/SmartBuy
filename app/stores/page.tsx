import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Package, Store as StoreIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";

export default async function StoresPage() {
  const stores = await prisma.store.findMany({
    where: { status: "APPROVED" },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, description: true, logo: true, _count: { select: { products: true } } },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 sm:pb-24 sm:pt-12">
      <div className="mb-10 grid gap-6 border-b border-border pb-9 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)] lg:items-end">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary"><BadgeCheck className="size-4" aria-hidden="true" /> Verified marketplace</p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Shop trusted stores.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">Explore independent electronics sellers reviewed and approved for the SmartBuy marketplace.</p>
        </div>
        <div className="rounded-2xl bg-primary/[0.06] p-5 ring-1 ring-primary/10">
          <p className="text-3xl font-bold tracking-[-0.03em] text-primary">{stores.length}</p>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{stores.length === 1 ? "approved store" : "approved stores"} ready to explore</p>
        </div>
      </div>
      {stores.length === 0 ? (
        <EmptyState icon={<StoreIcon className="size-6" />} title="No stores available" description="Approved marketplace stores will appear here." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Link key={store.id} href={`/stores/${store.slug}`} className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
              <Card className="h-full border-0 py-0 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.45)] ring-1 ring-border transition-[transform,box-shadow] duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_-36px_rgba(37,99,235,0.3)] motion-reduce:transition-none">
                <CardHeader className="p-6 pb-4"><div className="flex items-center gap-4">{store.logo ? <Image src={store.logo} alt={`${store.name} logo`} width={56} height={56} unoptimized className="size-14 rounded-xl bg-muted object-cover ring-1 ring-border" /> : <span className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary"><StoreIcon className="size-6" aria-hidden="true" /></span>}<div className="min-w-0"><CardTitle className="truncate text-xl tracking-[-0.02em]">{store.name}</CardTitle><p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-success"><BadgeCheck className="size-3.5" aria-hidden="true" /> Approved seller</p></div></div></CardHeader>
                <CardContent className="flex h-full flex-col px-6 pb-6"><p className="line-clamp-3 min-h-[3.75rem] text-sm leading-5 text-muted-foreground">{store.description || "Explore this seller's collection on SmartBuy."}</p><div className="mt-6 flex items-center justify-between border-t border-border pt-4"><p className="flex items-center gap-2 text-sm font-medium"><Package className="size-4 text-muted-foreground" aria-hidden="true" /> {store._count.products} {store._count.products === 1 ? "product" : "products"}</p><ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" /></div></CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
