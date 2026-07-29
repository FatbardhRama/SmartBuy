import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};


async function getOrder(id: string) {
  const res = await fetch(
    `http://localhost:3000/api/orders/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}


export default async function OrderDetailsPage({
  params,
}: Props) {

  const session = await getServerSession(authOptions);


  if (!session?.user) {
    redirect("/login");
  }


  const order = await getOrder(params.id);


  if (!order) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold">
          Order not found
        </h1>
      </main>
    );
  }


  return (
    <main className="max-w-5xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-6">
        Order Details
      </h1>


      <div className="border rounded-lg p-6 space-y-4">

        <div>
          <p className="text-sm text-muted-foreground">
            Order ID
          </p>

          <p className="font-medium">
            {order.id}
          </p>
        </div>


        <div>
          <p className="text-sm text-muted-foreground">
            Status
          </p>

          <p className="font-semibold">
            {order.status}
          </p>
        </div>


        <div>
          <p className="text-sm text-muted-foreground">
            Date
          </p>

          <p>
            {new Date(
              order.createdAt
            ).toLocaleDateString()}
          </p>
        </div>


      </div>


      <div className="border rounded-lg p-6 mt-6">

        <h2 className="text-xl font-bold mb-4">
          Shipping Information
        </h2>


        <p>{order.fullName}</p>
        <p>{order.email}</p>
        <p>{order.phone}</p>
        <p>
          {order.address}, {order.city}
        </p>
        <p>
          {order.postalCode}
        </p>

      </div>


      <div className="border rounded-lg p-6 mt-6">

        <h2 className="text-xl font-bold mb-4">
          Products
        </h2>


        <div className="space-y-4">

          {order.items.map((item: any) => (

            <div
              key={item.id}
              className="flex justify-between"
            >

              <div>
                <p className="font-medium">
                  {item.product.name}
                </p>

                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
              </div>


              <p>
                ${item.price}
              </p>

            </div>

          ))}

        </div>

      </div>


      <div className="mt-6 text-right">

        <p className="text-2xl font-bold">
          Total: ${order.total}
        </p>

      </div>


    </main>
  );
}