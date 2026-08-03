import Link from "next/link";
import Image from "next/image";
import { PackageOpen } from "lucide-react";

import { DeleteSellerProductButton } from "@/components/seller/DeleteSellerProductButton";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/formatCurrency";
import { getApprovedSellerStore } from "@/lib/seller";
import { prisma } from "@/lib/prisma";

export default async function SellerProductsPage() {
  const seller = await getApprovedSellerStore();
  if (seller.error) return null;
  const products = await prisma.product.findMany({ where: { storeId: seller.store.id }, orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-muted-foreground">{seller.store.name}</p><h1 className="text-3xl font-bold">My Products</h1></div><Link href="/seller/products/new" className={buttonVariants()}>Add Product</Link></div>
      {products.length === 0 ? <EmptyState icon={<PackageOpen className="size-6" />} title="No products yet" description="Add your first product to start building your store catalog." action={<Link href="/seller/products/new" className={buttonVariants()}>Add product</Link>} /> : (
        <div className="grid gap-4">{products.map((product) => (
          <Card key={product.id}><CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <Image src={product.image} alt={product.name} width={80} height={80} unoptimized className="size-20 rounded-md border object-cover" />
            <div className="min-w-0 flex-1"><h2 className="truncate font-semibold">{product.name}</h2><p className="text-sm text-muted-foreground">{product.category}</p></div>
            <div className="sm:text-right"><p className="font-semibold">{formatCurrency(product.price)}</p><p className="text-sm text-muted-foreground">Stock: {product.stock}</p></div>
            <div className="flex gap-2"><Link href={`/seller/products/${product.id}/edit`} className={buttonVariants({ size: "sm", variant: "outline" })}>Edit</Link><DeleteSellerProductButton productId={product.id} /></div>
          </CardContent></Card>
        ))}</div>
      )}
    </main>
  );
}
