import Link from "next/link";
import { ArrowRight, CalendarDays, ClipboardList, Store } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/formatCurrency";

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const statusBadgeVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "secondary",
  PROCESSING: "default",
  SHIPPED: "outline",
  DELIVERED: "default",
  CANCELLED: "destructive",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
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
    <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-12">
      <div className="relative mb-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(118deg,#FFFFFF_0%,#F1F7FF_56%,#ECFEFF_100%)] px-6 py-8 shadow-[0_24px_64px_-46px_rgba(37,99,235,0.42)] ring-1 ring-border/80 sm:mb-10 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="sb-eyebrow">Purchase history</p>
          <h1 className="sb-heading-xl">My orders</h1>
          <p className="mt-3 text-muted-foreground">
            Review your recent purchases and current order status.
          </p>
        </div>

        <p className="w-fit rounded-xl bg-primary/[0.06] px-3 py-2 text-sm font-medium text-muted-foreground ring-1 ring-primary/10">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="size-6" aria-hidden="true" />}
          title="You have no orders yet"
          description="When you place an order, its details and status will appear here."
          action={
            <Link href="/products">
              <Button className="rounded-xl">Browse electronics</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden rounded-[1.5rem] border-0 ring-1 ring-border/80 transition-shadow duration-300 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:hover:shadow-[0_24px_54px_-38px_rgba(37,99,235,0.28)]">
              <CardHeader className="flex flex-col gap-4 border-b border-border/70 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardDescription>Order reference</CardDescription>
                  <CardTitle className="mt-1 break-all text-lg">#{order.id}</CardTitle>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><p className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" /> {formatDate(order.createdAt)}</p><p className="flex items-center gap-2"><Store className="size-4 text-primary" /> {order.store.name}</p></div>
                </div>

                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <Badge variant={statusBadgeVariant[order.status] ?? "outline"} className="rounded-lg">
                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </Badge>
                  <p className="text-xl font-bold tracking-[-0.03em] tabular-nums">{formatCurrency(order.total)}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 py-1">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex flex-col gap-1 rounded-xl bg-muted/35 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-medium tabular-nums">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-stretch sm:justify-end">
                  <Link href={`/orders/${order.id}`} className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full gap-2 rounded-xl sm:w-auto">View details <ArrowRight className="size-4" /></Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
