import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
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
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">
        Admin Orders
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <h2 className="text-lg font-semibold">No orders yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Customer orders will appear here once they place purchases.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="border rounded-lg p-6 space-y-4"
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold">
                    Order #{order.id}
                  </h2>

                  <p>
                    Customer: {order.fullName}
                  </p>

                  <p>
                    Email: {order.email}
                  </p>
                </div>

                <div className="text-right">
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