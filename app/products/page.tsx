import ProductsClient from "@/components/products/ProductsClient";
import { getApprovedProducts } from "@/lib/products-query";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string | string[];
    category?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
};

function getFirstValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const query = await searchParams;
  const search = getFirstValue(query.search).trim();
  const category = getFirstValue(query.category).trim() || "All";
  const sort = getFirstValue(query.sort).trim() || "newest";
  const parsedPage = Number(getFirstValue(query.page));
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const data = await getApprovedProducts({
    page,
    limit: 12,
    search,
    category,
    sort,
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-18 pt-8 sm:pb-24 sm:pt-12">
      <div className="relative mb-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(118deg,#FFFFFF_0%,#F1F7FF_56%,#ECFEFF_100%)] px-6 py-10 shadow-[0_28px_72px_-48px_rgba(37,99,235,0.52)] ring-1 ring-border/80 sm:mb-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -right-16 -top-24 size-80 rounded-full bg-primary/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-[38%] h-px w-2/5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
        <div className="relative max-w-3xl">
          <p className="sb-eyebrow">The SmartBuy catalog</p>
          <h1 className="sb-heading-xl">Tech worth bringing home.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Browse electronics from approved marketplace sellers, with clear availability and the details you need to choose confidently.</p>
        </div>
      </div>

      <ProductsClient
        products={data.products}
        initialSearch={search}
        initialCategory={category}
        initialSort={sort}
        initialPage={page}
        initialTotal={data.total}
        initialTotalPages={data.totalPages}
      />
    </div>
  );
}
