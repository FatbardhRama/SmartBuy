import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/formatCurrency";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";


type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  productName: string;
  productImage: string;
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

  store: {
    name: string;
    slug: string;
  };

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

      store: true,

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

      <main className="mx-auto flex min-h-[55vh] max-w-5xl items-center justify-center px-6 py-12">
        <EmptyState icon={<ClipboardX className="size-6" />} title="Order not found" description="This order may not exist or may not belong to your account." action={<div className="flex flex-col justify-center gap-3 sm:flex-row"><Link href="/orders"><Button>View my orders</Button></Link><Link href="/products"><Button variant="outline">Browse electronics</Button></Link></div>} className="w-full max-w-xl" />
      </main>

    );

  }






  return (

    <main className="mx-auto w-full max-w-5xl px-6 pb-20 pt-10 sm:pb-24 sm:pt-12">



      <Link href="/orders" className="mb-6 inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"><ArrowLeft className="size-4" /> Back to orders</Link>

      <h1 className="mb-8 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
        Order details
      </h1>





      <div className="grid gap-5 rounded-2xl bg-card p-5 shadow-[0_14px_38px_-28px_rgba(15,23,42,0.4)] ring-1 ring-border/80 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">



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

          <p className="mt-1 w-fit rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
            {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
          </p>

        </div>

        <div>
          <p className="text-sm text-muted-foreground">Sold by</p>
          <Link href={`/stores/${order.store.slug}`} className="font-semibold text-primary hover:underline">
            {order.store.name}
          </Link>
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







      <div className="mt-6 rounded-2xl bg-card p-5 ring-1 ring-border/80 sm:p-6">


        <h2 className="mb-4 text-xl font-bold tracking-tight">
          Shipping information
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







      <div className="mt-6 rounded-2xl bg-card p-5 ring-1 ring-border/80 sm:p-6">


        <h2 className="mb-4 text-xl font-bold tracking-tight">
          Products
        </h2>





        <div className="space-y-4">


          {order.items.map((item) => (



            <div

              key={item.id}

              className="flex flex-col gap-2 rounded-xl bg-muted/35 p-3 sm:flex-row sm:items-center sm:justify-between"

            >



              <div>


                <p className="font-medium">

                  {item.productName}

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






      <div className="mt-6 rounded-2xl bg-primary/5 p-5 text-left ring-1 ring-primary/10 sm:text-right">


        <p className="text-2xl font-bold tracking-[-0.03em]">
          Total: {formatCurrency(order.total)}
        </p>


      </div>





    </main>

  );

}
