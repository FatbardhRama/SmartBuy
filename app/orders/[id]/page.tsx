import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/formatCurrency";
import { redirect } from "next/navigation";


type OrderItem = {
  id: string;
  quantity: number;
  price: number;

  product: {
    name: string;
  };
};


type Order = {
  id: string;
  status: string;
  createdAt: Date;

  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;

  total: number;

  items: OrderItem[];
};



type Props = {
  params: Promise<{
    id: string;
  }>;
};



async function getOrder(
  id: string,
  userId: string
): Promise<Order | null> {

  const order = await prisma.order.findFirst({

    where: {
      id,
      userId,
    },

    include: {

      items: {

        include: {

          product: true,

        },

      },

    },

  });


  return order;

}





export default async function OrderDetailsPage({
  params,
}: Props) {


  const session = await getServerSession(authOptions);



  if (!session?.user?.id) {

    redirect("/login");

  }



  const { id } = await params;



  const order = await getOrder(
    id,
    session.user.id
  );





  if (!order) {

    return (

      <main className="p-4 sm:p-10">

        <h1 className="text-2xl font-bold">
          Order not found
        </h1>

      </main>

    );

  }






  return (

    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">



      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
        Order Details
      </h1>





      <div className="space-y-4 rounded-lg border p-4 sm:p-6">



        <div>

          <p className="text-sm text-muted-foreground">
            Order ID
          </p>

          <p className="break-all font-medium">
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







      <div className="mt-6 rounded-lg border p-4 sm:p-6">


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







      <div className="mt-6 rounded-lg border p-4 sm:p-6">


        <h2 className="text-xl font-bold mb-4">
          Products
        </h2>





        <div className="space-y-4">


          {order.items.map((item) => (



            <div

              key={item.id}

              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"

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
                {formatCurrency(item.price)}
              </p>




            </div>



          ))}



        </div>



      </div>






      <div className="mt-6 text-left sm:text-right">


        <p className="text-2xl font-bold">
          Total: {formatCurrency(order.total)}
        </p>


      </div>





    </main>

  );

}
