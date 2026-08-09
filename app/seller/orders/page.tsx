import { ClipboardList, MapPin, Package, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

import { SellerOrderStatusSelect } from "@/components/seller/SellerOrderStatusSelect";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/formatCurrency";
import { prisma } from "@/lib/prisma";
import { getApprovedSellerStore } from "@/lib/seller";

export default async function SellerOrdersPage() {
  const seller = await getApprovedSellerStore();
  if (seller.error === "UNAUTHENTICATED") redirect("/login");
  if (seller.error) redirect("/seller");

  const orders = await prisma.order.findMany({
    where: { storeId: seller.store.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-12">
      <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(118deg,#FFFFFF_0%,#F1F7FF_56%,#ECFEFF_100%)] px-6 py-8 shadow-[0_24px_64px_-46px_rgba(37,99,235,0.42)] ring-1 ring-border/80 sm:mb-10 sm:px-9 sm:py-10"><div className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full bg-primary/10 blur-2xl" /><div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="sb-eyebrow">{seller.store.name}</p><h1 className="sb-heading-xl">Seller orders</h1><p className="mt-3 sb-muted-copy">Review purchases and keep customers informed as orders progress.</p></div>
        <div className="rounded-xl bg-primary/[0.06] px-5 py-4 ring-1 ring-primary/10"><span className="text-2xl font-bold text-primary">{orders.length}</span> <span className="text-sm text-muted-foreground">{orders.length === 1 ? "order" : "orders"}</span></div>
      </div>
      </section>
      {orders.length === 0 ? (
        <EmptyState icon={<ClipboardList className="size-6" />} title="No orders yet" description="Orders containing your store's products will appear here." />
      ) : (
        <div className="space-y-5">{orders.map((order) => (
          <Card key={order.id} className="overflow-hidden rounded-[1.5rem] border-0 py-0 sb-surface sb-surface-hover">
            <CardHeader className="flex flex-col gap-4 border-b border-border bg-muted/25 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
              <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Order</p><CardTitle className="mt-1 break-all text-lg tracking-[-0.02em]">#{order.id}</CardTitle><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><UserRound className="size-4" aria-hidden="true" /> {order.fullName}</span><span className="flex items-center gap-1.5"><MapPin className="size-4" aria-hidden="true" /> {order.createdAt.toLocaleDateString()}</span></div></div>
              <div className="flex flex-wrap items-center gap-3"><Badge variant="outline" className="rounded-full bg-background px-3 py-1">{order.status}</Badge><SellerOrderStatusSelect orderId={order.id} currentStatus={order.status} /></div>
            </CardHeader>
            <CardContent className="space-y-4 p-5 sm:p-6">
              <div className="space-y-3">{order.items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 text-sm"><span className="flex items-center gap-2"><Package className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" /> {item.productName} <span className="text-muted-foreground">× {item.quantity}</span></span><span className="font-medium">{formatCurrency(item.price * item.quantity)}</span></div>)}</div>
              <div className="flex justify-between border-t border-border pt-4 text-lg font-bold"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
            </CardContent>
          </Card>
        ))}</div>
      )}
    </main>
  );
}
