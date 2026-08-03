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
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-3xl font-bold sm:mb-8 sm:text-4xl">Products</h1>

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
