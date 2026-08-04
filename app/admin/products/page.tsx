import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/formatCurrency";


async function getProducts() {
  return await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}



export default async function AdminProductsPage() {

  const session = await getServerSession(authOptions);


  if (!session?.user) {
    redirect("/login");
  }


  if (session.user.role !== "ADMIN") {
    redirect("/");
  }


  const products = await getProducts();



  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-12">


      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <h1 className="text-2xl font-bold sm:text-3xl">
          Admin Products
        </h1>


        <Link href="/admin/products/new">

          <button className="min-h-10 w-full rounded-md border px-4 py-2 sm:w-auto">
            Add Product
          </button>

        </Link>

      </div>



      {products.length === 0 ? (

        <EmptyState
          icon={<PackageOpen className="size-6" aria-hidden="true" />}
          title="No products available"
          description="Create your first product to start building the catalog."
          action={
            <Link href="/admin/products/new">
              <button className="rounded-md border px-4 py-2">
                Add product
              </button>
            </Link>
          }
        />


      ) : (


        <div className="space-y-6">


          {products.map((product) => (


            <div
              key={product.id}
              className="rounded-lg border p-4 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 sm:p-6"
            >


              <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">


                <div className="min-w-0">


                  <h2 className="break-words text-xl font-semibold">
                    {product.name}
                  </h2>


                  <p className="text-sm text-muted-foreground">
                    {product.category}
                  </p>


                  <p className="mt-2">
                    {product.description}
                  </p>


                </div>




                <div className="text-left sm:shrink-0 sm:text-right">


                  <p className="font-bold">
                    {formatCurrency(product.price)}
                  </p>


                  <p className="break-all text-sm">
                    Stock: {product.stock}
                  </p>


                  <p className="text-sm">
                    ID: {product.id}
                  </p>




                  <div className="mt-4 flex flex-wrap gap-2">


                    <Link
                      href={`/admin/products/${product.id}/edit`}
                    >

                      <button className="border rounded-md px-4 py-2">
                        Edit
                      </button>

                    </Link>




                    <DeleteProductButton
                      productId={product.id}
                    />


                  </div>


                </div>


              </div>


            </div>


          ))}


        </div>


      )}


    </main>
  );
}
