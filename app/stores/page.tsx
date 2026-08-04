import Image from "next/image";
import Link from "next/link";
import { Store as StoreIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";

export default async function StoresPage() {
  const stores = await prisma.store.findMany({
    where: { status: "APPROVED" },
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, description: true, logo: true, _count: { select: { products: true } } },
  });

  return <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-12">
    <div className="mb-8"><h1 className="text-3xl font-bold sm:text-4xl">Stores</h1><p className="mt-2 text-muted-foreground">Explore approved sellers on SmartBuy.</p></div>
    {stores.length === 0 ? <EmptyState icon={<StoreIcon className="size-6" />} title="No stores available" description="Approved marketplace stores will appear here." /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {stores.map((store) => <Link key={store.id} href={`/stores/${store.slug}`} className="group block h-full"><Card className="h-full transition-shadow group-hover:shadow-md"><CardHeader><div className="flex items-center gap-3">{store.logo ? <Image src={store.logo} alt="" width={48} height={48} unoptimized className="size-12 rounded-lg border object-cover" /> : <span className="flex size-12 items-center justify-center rounded-lg bg-muted"><StoreIcon className="size-5" /></span>}<CardTitle>{store.name}</CardTitle></div></CardHeader><CardContent><p className="line-clamp-3 text-sm text-muted-foreground">{store.description || "Visit this store on SmartBuy."}</p><p className="mt-4 text-sm font-medium">{store._count.products} {store._count.products === 1 ? "product" : "products"}</p></CardContent></Card></Link>)}
    </div>}
  </main>;
}
