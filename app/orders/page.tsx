import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

async function getOrders() {
  const res = await fetch(
    "http://localhost:3000/api/orders/my-orders",
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}


export default async function OrdersPage() {

  const session = await getServerSession(authOptions);


  if (!session?.user) {
    redirect("/login");
  }


  const orders = await getOrders();


  return (
    <main className="max-w-5xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-8">
        My Orders
      </h1>


      {orders.length === 0 ? (

        <p>
          You have no orders yet.
        </p>

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

                  <p className="text-sm text-gray-500">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>

                  <p className="text-sm mt-1">
                    Status:{" "}
                    <span className="font-medium">
                      {order.status}
                    </span>
                  </p>
                </div>


                <p className="font-bold">
                  ${order.total}
                </p>

              </div>



              <div className="space-y-2">

                {order.items.map((item: any) => (

                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >

                    <span>
                      {item.product.name}
                      {" "}
                      x {item.quantity}
                    </span>


                    <span>
                      ${item.price}
                    </span>

                  </div>

                ))}

              </div>


              <Link href={`/orders/${order.id}`}>
                <Button>
                  View Details
                </Button>
              </Link>


            </div>

          ))}

        </div>

      )}

    </main>
  );
}