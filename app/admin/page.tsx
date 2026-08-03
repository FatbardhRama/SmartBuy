import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatCurrency";
import { RevenueChart } from "@/components/admin/RevenueChart";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.count();

  const products = await prisma.product.count();

  const lowStockProducts = await prisma.product.findMany({
    where: {
      stock: {
        lte: 5,
      },
    },
    orderBy: {
      stock: "asc",
    },
    select: {
      id: true,
      name: true,
      image: true,
      stock: true,
    },
  });

  const orders = await prisma.order.count();

  const revenue = await prisma.order.aggregate({
    where: {
      status: {
        not: "CANCELLED",
      },
    },
    _sum: {
      total: true,
    },
  });

  const revenueOrders = await prisma.order.findMany({
    where: {
      status: {
        not: "CANCELLED",
      },
    },
    select: {
      total: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const revenueByMonth = new Map<string, {
    month: string;
    revenue: number;
  }>();

  for (const order of revenueOrders) {
    const year = order.createdAt.getUTCFullYear();
    const month = order.createdAt.getUTCMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
    const monthLabel = new Intl.DateTimeFormat("en-GB", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month)));
    const existingRevenue = revenueByMonth.get(monthKey);

    revenueByMonth.set(monthKey, {
      month: monthLabel,
      revenue: (existingRevenue?.revenue ?? 0) + order.total,
    });
  }

  const monthlyRevenue = Array.from(revenueByMonth.values());

  const bestSellerGroups = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: {
        status: {
          not: "CANCELLED",
        },
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  const bestSellerProductIds = bestSellerGroups
    .map((group) => group.productId)
    .filter((productId): productId is string => productId !== null);

  const bestSellerProducts = await prisma.product.findMany({
    where: {
      id: {
        in: bestSellerProductIds,
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  const productsById = new Map(
    bestSellerProducts.map((product) => [product.id, product])
  );

  const bestSellers = bestSellerGroups.flatMap((group) => {
    if (!group.productId) {
      return [];
    }

    const product = productsById.get(group.productId);

    if (!product) {
      return [];
    }

    return [{
      ...product,
      quantitySold: group._sum.quantity ?? 0,
    }];
  });

  const recentOrders = await prisma.order.findMany({
    take: 5,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Admin Dashboard
        </h1>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Link href="/admin/products">
            <button className="min-h-10 w-full rounded-md border px-4 py-2 sm:w-auto">
              Manage Products
            </button>
          </Link>

          <Link href="/admin/orders">
            <button className="min-h-10 w-full rounded-md border px-4 py-2 sm:w-auto">
              Manage Orders
            </button>
          </Link>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <div className="border rounded-lg p-6">
          <p className="text-sm text-gray-500">
            Users
          </p>

          <p className="text-3xl font-bold">
            {users}
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <p className="text-sm text-gray-500">
            Products
          </p>

          <p className="text-3xl font-bold">
            {products}
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <p className="text-sm text-gray-500">
            Orders
          </p>

          <p className="text-3xl font-bold">
            {orders}
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <p className="text-sm text-gray-500">
            Revenue
          </p>

          <p className="text-3xl font-bold">
            {formatCurrency(revenue._sum.total ?? 0)}
          </p>
        </div>
      </div>

      <section className="mb-10 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2">
        <h2 className="text-2xl font-bold mb-6">
          Revenue Analytics
        </h2>

        <RevenueChart data={monthlyRevenue} />
      </section>

      <section className="mb-10 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2">
        <h2 className="text-2xl font-bold mb-6">
          Best Sellers
        </h2>

        {bestSellers.length === 0 ? (
          <p>No product sales found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {bestSellers.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4"
              >
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="mb-4 h-16 w-16 rounded-md object-cover"
                  />
                )}

                <h3 className="font-semibold">
                  {product.name}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {product.quantitySold} sold
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">
          Low Stock Products
        </h2>

        {lowStockProducts.length === 0 ? (
          <p>No low stock products found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4"
              >
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="mb-4 h-16 w-16 rounded-md object-cover"
                  />
                )}

                <h3 className="font-semibold">
                  {product.name}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Stock: {product.stock}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2">
        <h2 className="text-2xl font-bold mb-6">
          Recent Orders
        </h2>

        {recentOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
              className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div>
                  <h3 className="font-semibold">
                    Order #{order.id}
                  </h3>

                  <p>{order.fullName}</p>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>

                  <p className="text-sm">
                    Status: {order.status}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-bold">
                    {formatCurrency(order.total)}
                  </p>

                  <p className="text-sm">
                    {order.items.length} item(s)
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
