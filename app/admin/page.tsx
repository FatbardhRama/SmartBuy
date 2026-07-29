import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

async function getDashboardData() {
  const res = await fetch(
    "http://localhost:3000/api/admin/dashboard",
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const data = await getDashboardData();

  if (!data) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">
          Admin Dashboard
        </h1>

        <p>Failed to load dashboard.</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <div className="flex gap-3">
          <Link href="/admin/products">
            <button className="border rounded-md px-4 py-2">
              Manage Products
            </button>
          </Link>

          <Link href="/admin/orders">
            <button className="border rounded-md px-4 py-2">
              Manage Orders
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="border rounded-lg p-6">
          <p className="text-sm text-gray-500">
            Users
          </p>

          <p className="text-3xl font-bold">
            {data.users}
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <p className="text-sm text-gray-500">
            Products
          </p>

          <p className="text-3xl font-bold">
            {data.products}
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <p className="text-sm text-gray-500">
            Orders
          </p>

          <p className="text-3xl font-bold">
            {data.orders}
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <p className="text-sm text-gray-500">
            Revenue
          </p>

          <p className="text-3xl font-bold">
            ${data.revenue}
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6">
          Recent Orders
        </h2>

        {data.recentOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-4">
            {data.recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="border rounded-lg p-5 flex justify-between items-center"
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

                <div className="text-right">
                  <p className="font-bold">
                    ${order.total}
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