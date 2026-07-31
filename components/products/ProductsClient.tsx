"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import ProductsGrid from "./ProductsGrid";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type ProductsClientProps = {
  products: Product[];
};

export default function ProductsClient({
  products,
}: ProductsClientProps) {
  const [search, setSearch] = useState("");

  const [filteredProducts, setFilteredProducts] = useState(products);


  useEffect(() => {
    async function searchProducts() {
      const res = await fetch(
        `/api/products?search=${search}`
      );

      const data = await res.json();

      setFilteredProducts(data);
    }

    searchProducts();
  }, [search]);


  return (
    <>
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>


      <ProductsGrid products={filteredProducts} />
    </>
  );
}