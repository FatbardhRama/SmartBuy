import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";


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
    <main className="max-w-6xl mx-auto px-6 py-10">


      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Admin Products
        </h1>


        <Link href="/admin/products/new">

          <button className="border rounded-md px-4 py-2">
            Add Product
          </button>

        </Link>

      </div>



      {products.length === 0 ? (

        <p>
          No products found.
        </p>


      ) : (


        <div className="space-y-6">


          {products.map((product) => (


            <div
              key={product.id}
              className="border rounded-lg p-6"
            >


              <div className="flex justify-between">


                <div>


                  <h2 className="text-xl font-semibold">
                    {product.name}
                  </h2>


                  <p className="text-sm text-gray-500">
                    {product.category}
                  </p>


                  <p className="mt-2">
                    {product.description}
                  </p>


                </div>




                <div className="text-right">


                  <p className="font-bold">
                    €{product.price}
                  </p>


                  <p className="text-sm">
                    Stock: {product.stock}
                  </p>


                  <p className="text-sm">
                    ID: {product.id}
                  </p>




                  <div className="flex gap-2 mt-4">


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