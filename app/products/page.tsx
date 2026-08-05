import ProductsClient from "@/components/products/ProductsClient";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
  store?: { name: string; slug: string } | null;
};

type ProductsResponse = {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
};

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

async function getProducts(params: URLSearchParams): Promise<ProductsResponse> {
  const query = params.toString();
  const res = await fetch(
    `http://localhost:3000/api/products${query ? `?${query}` : ""}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
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

  const productParams = new URLSearchParams({
    page: page.toString(),
    limit: "12",
  });

  if (search) productParams.set("search", search);
  if (category !== "All") productParams.set("category", category);
  if (sort !== "newest") productParams.set("sort", sort);

  const data = await getProducts(productParams);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-18 pt-10 sm:pb-24 sm:pt-12">
      <div className="relative mb-10 overflow-hidden rounded-[1.75rem] bg-card px-6 py-9 ring-1 ring-border/80 sm:px-9 sm:py-11">
        <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-primary/6" />
        <div className="relative max-w-3xl">
          <p className="text-sm font-semibold text-primary">SmartBuy electronics</p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Find tech that fits your day</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Compare laptops, smartphones, gaming gear, audio, accessories, wearables, smart-home devices, and monitors from approved sellers.</p>
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
