import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Clock3,
  Package,
  PackageCheck,
  ShoppingCart,
  Warehouse,
} from "lucide-react";

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

  const [
    productSummary,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    revenue,
    products,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.product.aggregate({ where: { storeId: store.id }, _count: { _all: true }, _sum: { stock: true } }),
    prisma.order.count({ where: { storeId: store.id } }),
    prisma.order.count({ where: { storeId: store.id, status: "PENDING" } }),
    prisma.order.count({ where: { storeId: store.id, status: "DELIVERED" } }),
    prisma.order.aggregate({
      where: { storeId: store.id, status: "DELIVERED" },
      _sum: { total: true },
    }),
    prisma.product.findMany({ where: { storeId: store.id }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.order.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        total: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.product.findMany({
      where: { storeId: store.id, stock: { lte: 5 } },
      orderBy: [{ stock: "asc" }, { name: "asc" }],
      select: { id: true, name: true, category: true, stock: true },
    }),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-muted-foreground">Seller Dashboard</p><h1 className="text-3xl font-bold">{store.name}</h1></div><Link href="/seller/products/new" className={buttonVariants()}>Add Product</Link></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader><CardDescription className="flex items-center gap-2"><Package className="size-4" /> Total Products</CardDescription><CardTitle className="text-3xl">{productSummary._count._all}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription className="flex items-center gap-2"><ShoppingCart className="size-4" /> Total Orders</CardDescription><CardTitle className="text-3xl">{totalOrders}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription className="flex items-center gap-2"><Clock3 className="size-4" /> Pending Orders</CardDescription><CardTitle className="text-3xl">{pendingOrders}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription className="flex items-center gap-2"><CheckCircle2 className="size-4" /> Delivered Orders</CardDescription><CardTitle className="text-3xl">{deliveredOrders}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription className="flex items-center gap-2"><Banknote className="size-4" /> Revenue</CardDescription><CardTitle className="text-3xl">{formatCurrency(revenue._sum.total ?? 0)}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription className="flex items-center gap-2"><Warehouse className="size-4" /> Total stock</CardDescription><CardTitle className="text-3xl">{productSummary._sum.stock ?? 0}</CardTitle></CardHeader></Card>
      </div>
      <Card className="mt-6">
        <CardHeader><div className="flex items-center justify-between gap-4"><div><CardTitle>Recent products</CardTitle><CardDescription>A quick summary of your latest listings.</CardDescription></div><Link href="/seller/products" className={buttonVariants({ variant: "outline" })}>My Products</Link></div></CardHeader>
        <CardContent>
          {products.length === 0 ? <div className="flex items-center gap-3 text-muted-foreground"><PackageCheck className="size-5" /><p>No products yet.</p></div> : (
            <div className="divide-y">{products.map((product) => <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{product.name}</p><p className="text-sm text-muted-foreground">{product.category}</p></div><div className="text-right"><p>{formatCurrency(product.price)}</p><p className="text-sm text-muted-foreground">Stock: {product.stock}</p></div></div>)}</div>
          )}
        </CardContent>
      </Card>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><div className="flex items-center justify-between gap-4"><div><CardTitle>Recent Orders</CardTitle><CardDescription>Your latest five customer orders.</CardDescription></div><Link href="/seller/orders" className={buttonVariants({ variant: "outline" })}>View Orders</Link></div></CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? <div className="flex items-center gap-3 text-muted-foreground"><ShoppingCart className="size-5" /><p>No orders yet.</p></div> : (
              <div className="divide-y">{recentOrders.map((order) => <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{order.fullName}</p><p className="text-sm text-muted-foreground">{order.createdAt.toLocaleDateString()}</p></div><div className="text-right"><p>{formatCurrency(order.total)}</p><Badge variant="secondary" className="mt-1">{order.status}</Badge></div></div>)}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div className="flex items-center justify-between gap-4"><div><CardTitle>Low Stock</CardTitle><CardDescription>Products with five or fewer units remaining.</CardDescription></div><Link href="/seller/products" className={buttonVariants({ variant: "outline" })}>Manage Products</Link></div></CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? <div className="flex items-center gap-3 text-muted-foreground"><PackageCheck className="size-5" /><p>All products are well stocked.</p></div> : (
              <div className="divide-y">{lowStockProducts.map((product) => <div key={product.id} className="flex items-center justify-between gap-3 py-3"><div><p className="font-medium">{product.name}</p><p className="text-sm text-muted-foreground">{product.category}</p></div><div className="flex items-center gap-2 text-amber-700 dark:text-amber-400"><AlertTriangle className="size-4" /><span className="font-medium">{product.stock} left</span></div></div>)}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
