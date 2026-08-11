import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CalendarDays, ClipboardList, Mail, Store, UserRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Prisma } from "@prisma/client";

interface AdminOrder {
  id: string;
  fullName: string;
  email: string;
  total: number;
  status: Prisma.OrderGetPayload<Prisma.OrderDefaultArgs>["status"];
  createdAt: Date;
  store: {
    name: string;
  };
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
  }>;
}

const statusBadgeVariant = {
  PENDING: "secondary",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
} as const;

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const orders: ReadonlyArray<AdminOrder> = await prisma.order.findMany({
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
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-12">
      <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(118deg,#FFFFFF_0%,#F1F7FF_56%,#ECFEFF_100%)] px-6 py-8 shadow-[0_24px_64px_-46px_rgba(37,99,235,0.42)] ring-1 ring-border/80 sm:mb-10 sm:px-9 sm:py-10"><div className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full bg-primary/10 blur-2xl" /><div className="relative"><p className="sb-eyebrow">Order administration</p><h1 className="sb-heading-xl">Order management</h1><p className="mt-3 sb-muted-copy">Review customer purchases and keep fulfillment statuses current.</p></div></section>

      {orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="size-6" aria-hidden="true" />}
          title="No orders yet"
          description="Customer orders will appear here once they place purchases."
        />
      ) : (
        <section className="overflow-hidden rounded-[1.5rem] sb-surface">
          <div className="flex flex-col gap-2 border-b border-border/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div><h2 className="font-semibold tracking-tight">Fulfillment queue</h2><p className="mt-1 text-sm text-muted-foreground">{orders.length} {orders.length === 1 ? "order" : "orders"} requiring visibility and status control.</p></div>
            <p className="text-xs font-medium text-muted-foreground">Use the control in each row to update fulfillment.</p>
          </div>
          <Table className="min-w-[1050px]">
            <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Store & items</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Control</TableHead></TableRow></TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="motion-safe:animate-in motion-safe:fade-in-0">
                  <TableCell className="max-w-44 whitespace-normal"><p className="font-semibold tracking-tight">#{order.id}</p><p className="mt-1 text-xs text-muted-foreground">{order.items.length} {order.items.length === 1 ? "item" : "items"}</p></TableCell>
                  <TableCell className="max-w-56 whitespace-normal"><p className="flex items-center gap-2 font-medium"><UserRound className="size-4 shrink-0 text-primary" /> <span className="truncate">{order.fullName}</span></p><p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><Mail className="size-3.5 shrink-0 text-primary" /> <span className="truncate">{order.email}</span></p></TableCell>
                  <TableCell className="max-w-xs whitespace-normal"><p className="flex items-center gap-2 font-medium"><Store className="size-4 shrink-0 text-primary" /> <span className="truncate">{order.store.name}</span></p><div className="mt-2 flex flex-wrap gap-1.5">{order.items.map((item) => <span key={item.id} className="max-w-44 truncate rounded-lg bg-muted px-2 py-1 text-xs text-muted-foreground" title={item.productName}>{item.productName} × {item.quantity}</span>)}</div></TableCell>
                  <TableCell><span className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="size-4 text-primary" />{new Date(order.createdAt).toLocaleDateString()}</span></TableCell>
                  <TableCell className="text-right text-base font-bold tabular-nums">{formatCurrency(order.total)}</TableCell>
                  <TableCell><Badge variant={statusBadgeVariant[order.status]}>{order.status.charAt(0) + order.status.slice(1).toLowerCase()}</Badge></TableCell>
                  <TableCell><OrderStatusSelect orderId={order.id} currentStatus={order.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </main>
  );
}
