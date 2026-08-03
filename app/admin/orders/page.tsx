import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";
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
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">
        Admin Orders
      </h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="size-6" aria-hidden="true" />}
          title="No orders yet"
          description="Customer orders will appear here once they place purchases."
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="space-y-4 rounded-lg border p-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div className="min-w-0">
                  <h2 className="break-all font-semibold">
                    Order #{order.id}
                  </h2>

                  <p>
                    Customer: {order.fullName}
                  </p>

                  <p>
                    Email: {order.email}
                  </p>
                </div>

                <div className="text-left sm:shrink-0 sm:text-right">
                  <p className="font-bold">
                    {formatCurrency(order.total)}
                  </p>

                  <div className="mt-2">
                    <p className="mb-2">
                      Status:
                    </p>

                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">
                  Products
                </h3>

                {order.items.map((item: any) => (
                  <p key={item.id}>
                    {item.product.name} x {item.quantity}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
