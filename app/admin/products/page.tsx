import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Edit3, PackageOpen, Plus } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/formatCurrency";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";


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
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 sm:pb-24 sm:pt-12">


      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold text-primary">Catalog administration</p><h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Product management</h1><p className="mt-3 text-muted-foreground">Review and maintain the marketplace product catalog.</p></div>


        <Link href="/admin/products/new" className={cn(buttonVariants(), "gap-2 rounded-xl")}><Plus className="size-4" /> Add product</Link>

      </div>



      {products.length === 0 ? (

        <EmptyState
          icon={<PackageOpen className="size-6" aria-hidden="true" />}
          title="No products available"
          description="Create your first product to start building the catalog."
          action={
            <Link href="/admin/products/new" className={cn(buttonVariants(), "rounded-xl")}>Add product</Link>
          }
        />


      ) : (


        <div className="overflow-hidden rounded-2xl bg-card shadow-[0_16px_42px_-30px_rgba(15,23,42,0.4)] ring-1 ring-border/80">


          {products.map((product) => (


            <div
              key={product.id}
              className="grid gap-5 border-b border-border/70 p-4 last:border-0 motion-safe:animate-in motion-safe:fade-in-0 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center sm:p-5"
            >
              <div className="relative size-18 overflow-hidden rounded-xl bg-muted">{product.image ? <Image src={product.image} alt={product.name} fill className="object-cover" sizes="72px" /> : <span className="flex h-full items-center justify-center"><PackageOpen className="size-6 text-muted-foreground" /></span>}</div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><h2 className="break-words text-lg font-semibold tracking-tight">
                    {product.name}
                  </h2><span className="rounded-lg bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">{product.category}</span></div>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{product.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">ID: {product.id}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <div className="mr-2 sm:text-right"><p className="font-bold tabular-nums">{formatCurrency(product.price)}</p><p className={`text-xs font-medium ${product.stock <= 5 ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground"}`}>{product.stock} in stock</p></div>
                  <Link href={`/admin/products/${product.id}/edit`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5 rounded-lg")}><Edit3 className="size-3.5" /> Edit</Link>
                  <DeleteProductButton productId={product.id} />
                </div>
            </div>


          ))}


        </div>


      )}


    </main>
  );
}
