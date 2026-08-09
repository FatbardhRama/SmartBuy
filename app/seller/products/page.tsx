import Link from "next/link";
import Image from "next/image";
import type { Prisma } from "@prisma/client";
import { ArrowLeft, ArrowRight, PackageOpen, Plus, Search, SlidersHorizontal } from "lucide-react";

import { DeleteSellerProductButton } from "@/components/seller/DeleteSellerProductButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/formatCurrency";
import { getApprovedSellerStore } from "@/lib/seller";
import { prisma } from "@/lib/prisma";

type SellerProductsPageProps = {
  searchParams: Promise<{
    search?: string | string[];
    category?: string | string[];
    stock?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
};

const PAGE_SIZE = 10;

function firstValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function SellerProductsPage({ searchParams }: SellerProductsPageProps) {
  const seller = await getApprovedSellerStore();
  if (seller.error) return null;

  const query = await searchParams;
  const search = firstValue(query.search).trim();
  const category = firstValue(query.category).trim();
  const stock = firstValue(query.stock);
  const sort = firstValue(query.sort) === "oldest" ? "oldest" : "newest";
  const requestedPage = Number(firstValue(query.page) || "1");

  const where: Prisma.ProductWhereInput = {
    storeId: seller.store.id,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category ? { category } : {}),
    ...(stock === "in-stock"
      ? { stock: { gt: 0 } }
      : stock === "low-stock"
        ? { stock: { gte: 1, lte: 5 } }
        : stock === "out-of-stock"
          ? { stock: 0 }
          : {}),
  };

  const [categoryRows, total] = await Promise.all([
    prisma.product.findMany({
      where: { storeId: seller.store.id },
      distinct: ["category"],
      orderBy: { category: "asc" },
      select: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Number.isInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, totalPages)
    : 1;
  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const hasFilters = Boolean(search || category || stock || sort === "oldest");
  const pageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (stock) params.set("stock", stock);
    if (sort === "oldest") params.set("sort", sort);
    if (targetPage > 1) params.set("page", String(targetPage));
    const value = params.toString();
    return value ? `/seller/products?${value}` : "/seller/products";
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-12">
      <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(118deg,#FFFFFF_0%,#F1F7FF_56%,#ECFEFF_100%)] px-6 py-8 shadow-[0_24px_64px_-46px_rgba(37,99,235,0.42)] ring-1 ring-border/80 sm:mb-10 sm:px-9 sm:py-10"><div className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full bg-primary/10 blur-2xl" /><div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="sb-eyebrow">{seller.store.name}</p><h1 className="sb-heading-xl">My products</h1><p className="mt-3 sb-muted-copy">Manage listings, pricing, and inventory in one place.</p></div><Link href="/seller/products/new" className={buttonVariants({ className: "w-fit rounded-xl" })}><Plus className="size-4" /> Add product</Link></div></section>
      <form className="mb-7 grid gap-3 rounded-[1.5rem] p-4 sb-surface sm:p-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto]" action="/seller/products">
        <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" /><Input name="search" defaultValue={search} placeholder="Search products..." aria-label="Search products" className="h-11 pl-9" /></div>
        <select name="category" defaultValue={category} className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" aria-label="Filter by category">
          <option value="">All categories</option>
          {categoryRows.map((row) => <option key={row.category} value={row.category}>{row.category}</option>)}
        </select>
        <select name="stock" defaultValue={stock} className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" aria-label="Filter by stock">
          <option value="">All stock</option>
          <option value="in-stock">In stock</option>
          <option value="low-stock">Low stock</option>
          <option value="out-of-stock">Out of stock</option>
        </select>
        <select name="sort" defaultValue={sort} className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" aria-label="Sort products">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
        <div className="flex gap-2"><Button type="submit" size="sm" className="rounded-xl"><SlidersHorizontal className="size-4" /> Apply</Button>{hasFilters && <Link href="/seller/products" className={buttonVariants({ size: "sm", variant: "outline", className: "rounded-xl" })}>Clear</Link>}</div>
      </form>
      <p className="mb-4 text-sm text-muted-foreground">{total} {total === 1 ? "product" : "products"}</p>
      {products.length === 0 ? <EmptyState icon={<PackageOpen className="size-6" />} title={hasFilters ? "No matching products" : "No products yet"} description={hasFilters ? "Try changing or clearing your filters." : "Add your first product to start building your store catalog."} action={hasFilters ? <Link href="/seller/products" className={buttonVariants({ variant: "outline" })}>Clear filters</Link> : <Link href="/seller/products/new" className={buttonVariants()}>Add product</Link>} /> : (
        <div className="grid gap-4">{products.map((product) => (
          <Card key={product.id} className="overflow-hidden rounded-[1.35rem] border-0 py-0 sb-surface sb-surface-hover"><CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
            <Image src={product.image} alt={product.name} width={80} height={80} unoptimized className="size-20 rounded-xl bg-muted object-cover ring-1 ring-border" />
            <div className="min-w-0 flex-1"><h2 className="truncate font-semibold">{product.name}</h2><p className="text-sm text-muted-foreground">{product.category}</p></div>
            <div className="sm:text-right"><p className="font-semibold tabular-nums">{formatCurrency(product.price)}</p><p className={`text-sm font-medium ${product.stock === 0 ? "text-destructive" : product.stock <= 5 ? "text-warning" : "text-success"}`}>Stock: {product.stock}</p></div>
            <div className="flex gap-2"><Link href={`/seller/products/${product.id}/edit`} className={buttonVariants({ size: "sm", variant: "outline" })}>Edit</Link><DeleteSellerProductButton productId={product.id} /></div>
          </CardContent></Card>
        ))}</div>
      )}
      {totalPages > 1 && <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Seller products pagination">
        {page > 1 && <Link href={pageHref(page - 1)} className={buttonVariants({ variant: "outline", className: "rounded-xl" })}><ArrowLeft className="size-4" /> Previous</Link>}
        <span className="rounded-xl bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">Page {page} of {totalPages}</span>
        {page < totalPages && <Link href={pageHref(page + 1)} className={buttonVariants({ variant: "outline", className: "rounded-xl" })}>Next <ArrowRight className="size-4" /></Link>}
      </nav>}
    </main>
  );
}
