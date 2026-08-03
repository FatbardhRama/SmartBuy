import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Package, PackageCheck, Warehouse } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { formatCurrency } from "@/lib/formatCurrency";
import { prisma } from "@/lib/prisma";

const statusMessages = {
  PENDING: "Your seller application is awaiting admin review. Product management will unlock after approval.",
  REJECTED: "Your seller application was not approved. Review or update your store details from the sell page.",
  SUSPENDED: "Your store is suspended, so seller product management is currently unavailable.",
};

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const store = await prisma.store.findUnique({ where: { ownerId: session.user.id } });
  if (!store) redirect("/sell");

  if (store.status !== "APPROVED") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Card>
          <CardHeader><div className="flex items-center justify-between gap-4"><CardTitle>{store.name}</CardTitle><Badge variant="secondary">{store.status}</Badge></div></CardHeader>
          <CardContent className="space-y-5"><p>{statusMessages[store.status]}</p><Link href="/sell" className={buttonVariants()}>View store application</Link></CardContent>
        </Card>
      </main>
    );
  }

  const [summary, products] = await Promise.all([
    prisma.product.aggregate({ where: { storeId: store.id }, _count: { _all: true }, _sum: { stock: true } }),
    prisma.product.findMany({ where: { storeId: store.id }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-muted-foreground">Seller Dashboard</p><h1 className="text-3xl font-bold">{store.name}</h1></div><Link href="/seller/products/new" className={buttonVariants()}>Add Product</Link></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card><CardHeader><CardDescription className="flex items-center gap-2"><Package className="size-4" /> Products</CardDescription><CardTitle className="text-3xl">{summary._count._all}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription className="flex items-center gap-2"><Warehouse className="size-4" /> Total stock</CardDescription><CardTitle className="text-3xl">{summary._sum.stock ?? 0}</CardTitle></CardHeader></Card>
      </div>
      <Card className="mt-6">
        <CardHeader><div className="flex items-center justify-between gap-4"><div><CardTitle>Recent products</CardTitle><CardDescription>A quick summary of your latest listings.</CardDescription></div><Link href="/seller/products" className={buttonVariants({ variant: "outline" })}>My Products</Link></div></CardHeader>
        <CardContent>
          {products.length === 0 ? <div className="flex items-center gap-3 text-muted-foreground"><PackageCheck className="size-5" /><p>No products yet.</p></div> : (
            <div className="divide-y">{products.map((product) => <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{product.name}</p><p className="text-sm text-muted-foreground">{product.category}</p></div><div className="text-right"><p>{formatCurrency(product.price)}</p><p className="text-sm text-muted-foreground">Stock: {product.stock}</p></div></div>)}</div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
