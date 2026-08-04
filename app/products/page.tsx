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
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-12">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">SmartBuy electronics</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Explore electronics</h1>
        <p className="mt-3 leading-7 text-muted-foreground">Compare laptops, smartphones, gaming gear, audio, accessories, wearables, smart-home devices, and monitors from approved sellers.</p>
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
