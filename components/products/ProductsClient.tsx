"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, PackageSearch, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";

import { ProductGridSkeleton } from "./ProductGridSkeleton";
import ProductsGrid from "./ProductsGrid";

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
  totalPages: number;
};

type ProductsClientProps = {
  products: Product[];
  initialSearch: string;
  initialCategory: string;
  initialSort: string;
  initialPage: number;
  initialTotal: number;
  initialTotalPages: number;
};

const categories = [
  "All",
  "Laptops",
  "Smartphones",
  "Gaming",
  "Audio",
  "Accessories",
  "Wearables",
  "Smart Home",
  "Monitors",
];

const sorts = new Set(["newest", "price-low", "price-high", "name-a", "name-z"]);

export default function ProductsClient({
  products,
  initialSearch,
  initialCategory,
  initialSort,
  initialPage,
  initialTotal,
  initialTotalPages,
}: ProductsClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRequest = useRef(true);

  const searchParamsString = searchParams?.toString() ?? "";
  const search = (searchParams?.get("search") ?? initialSearch).trim();
  const category = searchParams?.get("category") ?? initialCategory;
  const sort = searchParams?.get("sort") ?? initialSort;
  const requestedPage = Number(searchParams?.get("page") ?? initialPage);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const [displayedProducts, setDisplayedProducts] = useState(products);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const hasActiveFilters = search !== "" || category !== "All" || sort !== "newest";

  function updateSearchParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParamsString);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function clearFilters() {
    updateSearchParams({ search: null, category: null, sort: null, page: null });
  }

  useEffect(() => {
    setDisplayedProducts(products);
    setTotal(initialTotal);
    setTotalPages(initialTotalPages);
  }, [products, initialTotal, initialTotalPages]);

  useEffect(() => {
    if (initialRequest.current) {
      initialRequest.current = false;
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ page: page.toString(), limit: "12" });
        if (search) params.set("search", search);
        if (category !== "All") params.set("category", category);
        if (sort !== "newest") params.set("sort", sort);

        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load electronics.");
        }

        const data: ProductsResponse = await response.json();
        setDisplayedProducts(data.products);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        setError("We couldn’t load electronics right now. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [search, category, sort, page, retryCount]);

  const resultLabel = `${total} ${total === 1 ? "result" : "results"}`;

  return (
    <>
      <div className="mb-6 rounded-2xl bg-card p-4 shadow-[0_12px_35px_-26px_rgba(15,23,42,0.35)] ring-1 ring-border/80 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/8 text-primary"><SlidersHorizontal className="size-4" /></span>
            Search and filter
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-muted-foreground hover:text-primary">Clear all</Button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_14rem]">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search by product, category, or description"
              value={search}
              onChange={(event) => updateSearchParams({ search: event.target.value || null, page: null })}
              className="h-11 rounded-xl bg-background pl-10 shadow-none"
            />
          </div>

          <select
            value={category}
            onChange={(event) => updateSearchParams({ category: event.target.value === "All" ? null : event.target.value, page: null })}
            className="min-h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium shadow-none outline-none transition-[border-color,box-shadow] focus:border-primary focus:ring-3 focus:ring-primary/15"
            aria-label="Filter by category"
          >
            {categories.map((item) => <option key={item} value={item}>{item === "All" ? "All categories" : item}</option>)}
          </select>

          <select
            value={sorts.has(sort) ? sort : "newest"}
            onChange={(event) => updateSearchParams({ sort: event.target.value === "newest" ? null : event.target.value, page: null })}
            className="min-h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-medium shadow-none outline-none transition-[border-color,box-shadow] focus:border-primary focus:ring-3 focus:ring-primary/15"
            aria-label="Sort products"
          >
            <option value="newest">Newest first</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-a">Name: A-Z</option>
            <option value="name-z">Name: Z-A</option>
          </select>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4 text-sm" aria-live="polite">
        <p className="font-semibold text-foreground">{resultLabel}</p>
        <p className="text-muted-foreground">
          {search ? `Results for “${search}”` : category !== "All" ? `${category} products` : "All available electronics"}
        </p>
      </div>

      {error && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between" role="alert">
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={() => setRetryCount((count) => count + 1)}>Try again</Button>
        </div>
      )}

      {loading ? (
        <ProductGridSkeleton />
      ) : displayedProducts.length === 0 ? (
        <EmptyState
          icon={<PackageSearch className="size-6" aria-hidden="true" />}
          title={search ? `No electronics found for '${search}'` : "No electronics found"}
          description={hasActiveFilters ? "Try another search or clear your filters to explore the full catalog." : "New electronics will appear here as they are added to the catalog."}
          action={hasActiveFilters ? <Button variant="outline" onClick={clearFilters}>Clear filters</Button> : undefined}
        />
      ) : (
        <ProductsGrid products={displayedProducts} />
      )}

      {totalPages > 1 && (
        <nav className="mt-14 flex flex-wrap items-center justify-center gap-2 border-t border-border/70 pt-8" aria-label="Product pagination">
          <Button variant="outline" disabled={page === 1} onClick={() => updateSearchParams({ page: (page - 1).toString() })} className="gap-1.5 rounded-xl">
            <ChevronLeft className="size-4" /> Previous
          </Button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
            <Button key={number} variant={page === number ? "default" : "outline"} size="icon" onClick={() => updateSearchParams({ page: number === 1 ? null : number.toString() })} aria-current={page === number ? "page" : undefined} className="rounded-xl">
              {number}
            </Button>
          ))}

          <Button variant="outline" disabled={page === totalPages} onClick={() => updateSearchParams({ page: (page + 1).toString() })} className="gap-1.5 rounded-xl">
            Next <ChevronRight className="size-4" />
          </Button>
        </nav>
      )}
    </>
  );
}
