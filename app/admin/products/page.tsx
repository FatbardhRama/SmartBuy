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
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-12">
      <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(118deg,#FFFFFF_0%,#F1F7FF_56%,#ECFEFF_100%)] px-6 py-8 shadow-[0_24px_64px_-46px_rgba(37,99,235,0.42)] ring-1 ring-border/80 sm:mb-10 sm:px-9 sm:py-10"><div className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full bg-primary/10 blur-2xl" /><div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="sb-eyebrow">Catalog administration</p><h1 className="sb-heading-xl">Product management</h1><p className="mt-3 sb-muted-copy">Review and maintain the marketplace product catalog.</p></div><Link href="/admin/products/new" className={cn(buttonVariants(), "w-fit gap-2 rounded-xl")}><Plus className="size-4" /> Add product</Link></div></section>



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


        <section className="overflow-hidden rounded-[1.5rem] sb-surface">
          <div className="flex flex-col gap-3 border-b border-border/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-semibold tracking-tight">Catalog inventory</h2>
              <p className="mt-1 text-sm text-muted-foreground">{products.length} {products.length === 1 ? "product" : "products"} in the marketplace catalog.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
              <span className="rounded-lg bg-success/10 px-2.5 py-1 text-success">Healthy stock</span>
              <span className="rounded-lg bg-warning/10 px-2.5 py-1 text-amber-700 dark:text-amber-300">Low stock: 5 or fewer</span>
            </div>
          </div>
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Product</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Inventory</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const lowStock = product.stock <= 5;

                return (
                  <TableRow key={product.id} className="motion-safe:animate-in motion-safe:fade-in-0">
                    <TableCell>
                      <div className="relative size-12 overflow-hidden rounded-xl bg-muted">
                        {product.image ? <Image src={product.image} alt={product.name} fill className="object-cover" sizes="48px" /> : <span className="flex h-full items-center justify-center"><PackageOpen className="size-5 text-muted-foreground" /></span>}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-sm whitespace-normal">
                      <h2 className="font-semibold tracking-tight">{product.name}</h2>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
                      <p className="mt-1 text-xs text-muted-foreground">ID: {product.id}</p>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{product.category}</Badge></TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{formatCurrency(product.price)}</TableCell>
                    <TableCell className="text-right"><span className={cn("inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold", lowStock ? "bg-warning/10 text-amber-700 dark:text-amber-300" : "bg-success/10 text-success")}>{product.stock} in stock</span></TableCell>
                    <TableCell><div className="flex justify-end gap-2"><Link href={`/admin/products/${product.id}/edit`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5 rounded-lg")}><Edit3 className="size-3.5" /> Edit</Link><DeleteProductButton productId={product.id} /></div></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </section>


      )}


    </main>
  );
}
