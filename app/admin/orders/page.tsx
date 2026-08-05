import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CalendarDays, ClipboardList, Mail, Package, Store, UserRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/formatCurrency";

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      store: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 sm:pb-24 sm:pt-12">
      <div className="mb-10 max-w-2xl"><p className="text-sm font-semibold text-primary">Order administration</p><h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Order management</h1><p className="mt-3 text-muted-foreground">Review customer purchases and keep fulfillment statuses current.</p></div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="size-6" aria-hidden="true" />}
          title="No orders yet"
          description="Customer orders will appear here once they place purchases."
        />
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl bg-card shadow-[0_14px_38px_-28px_rgba(15,23,42,0.4)] ring-1 ring-border/80 motion-safe:animate-in motion-safe:fade-in-0"
            >
              <div className="flex flex-col gap-5 border-b border-border/70 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                <div className="min-w-0"><p className="text-xs font-medium text-muted-foreground">Order reference</p><h2 className="mt-1 break-all font-semibold tracking-tight">#{order.id}</h2><div className="mt-4 grid gap-x-6 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2"><p className="flex items-center gap-2"><UserRound className="size-4 text-primary" /> {order.fullName}</p><p className="flex items-center gap-2"><Mail className="size-4 text-primary" /> {order.email}</p><p className="flex items-center gap-2"><Store className="size-4 text-primary" /> {order.store.name}</p><p className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" /> {new Date(order.createdAt).toLocaleDateString()}</p></div></div>
                <div className="shrink-0 sm:text-right"><p className="text-xs text-muted-foreground">Order total</p><p className="mt-1 text-2xl font-bold tracking-[-0.03em] tabular-nums">{formatCurrency(order.total)}</p><div className="mt-3"><OrderStatusSelect orderId={order.id} currentStatus={order.status} /></div></div>
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><Package className="size-4 text-primary" /> Products <span className="font-normal text-muted-foreground">({order.items.length})</span></h3>
                <div className="grid gap-2 sm:grid-cols-2">{order.items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl bg-muted/40 px-3 py-2.5 text-sm"><span className="min-w-0 truncate font-medium">{item.productName}</span><span className="shrink-0 text-muted-foreground">Qty {item.quantity}</span></div>)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
