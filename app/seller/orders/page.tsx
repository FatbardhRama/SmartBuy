import { ClipboardList } from "lucide-react";
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
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8"><p className="text-sm text-muted-foreground">{seller.store.name}</p><h1 className="text-3xl font-bold">Seller Orders</h1></div>
      {orders.length === 0 ? (
        <EmptyState icon={<ClipboardList className="size-6" />} title="No orders yet" description="Orders containing your store's products will appear here." />
      ) : (
        <div className="space-y-5">{orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-col gap-4 border-b sm:flex-row sm:items-start sm:justify-between">
              <div><CardTitle className="break-all text-lg">Order #{order.id}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{order.createdAt.toLocaleDateString()} · Customer: {order.fullName}</p></div>
              <div className="flex items-center gap-3"><Badge variant="outline">{order.status}</Badge><SellerOrderStatusSelect orderId={order.id} currentStatus={order.status} /></div>
            </CardHeader>
            <CardContent className="space-y-4 py-5">
              <div className="space-y-2">{order.items.map((item) => <div key={item.id} className="flex justify-between gap-4 text-sm"><span>{item.productName} × {item.quantity}</span><span>{formatCurrency(item.price * item.quantity)}</span></div>)}</div>
              <div className="flex justify-between border-t pt-4 font-semibold"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
            </CardContent>
          </Card>
        ))}</div>
      )}
    </main>
  );
}
