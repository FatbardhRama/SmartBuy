import Link from "next/link";
import { ClipboardList } from "lucide-react";
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
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">My Orders</h1>
          <p className="text-sm text-muted-foreground">
            Review your recent purchases and current order status.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="size-6" aria-hidden="true" />}
          title="You have no orders yet"
          description="When you place an order, its details and status will appear here."
          action={
            <Link href="/products">
              <Button>Browse products</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2">
              <CardHeader className="flex flex-col gap-4 border-b sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="break-all text-lg">Order #{order.id}</CardTitle>
                  <CardDescription className="mt-2">
                    Placed {formatDate(order.createdAt)}
                  </CardDescription>
                  <p className="mt-2 text-sm">Sold by: <span className="font-medium">{order.store.name}</span></p>
                </div>

                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <Badge variant={statusBadgeVariant[order.status] ?? "outline"}>
                    {order.status}
                  </Badge>
                  <p className="text-lg font-semibold">{formatCurrency(order.total)}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 py-6">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-1 border-b pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-medium">{formatCurrency(item.price)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-stretch sm:justify-end">
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" className="w-full sm:w-auto">View Details</Button>
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
