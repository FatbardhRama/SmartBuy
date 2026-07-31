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

const categories = [
  "All",
  "Laptops",
  "Smartphones",
  "Tablets",
  "Monitors",
  "Headphones",
  "Accessories",
];


export default function ProductsClient({
  products,
}: ProductsClientProps) {

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [filteredProducts, setFilteredProducts] = useState(products);

  const [loading, setLoading] = useState(false);


  useEffect(() => {

    const timeout = setTimeout(async () => {

      try {

        setLoading(true);


        const params = new URLSearchParams();


        if (search) {
          params.append("search", search);
        }


        if (category !== "All") {
          params.append("category", category);
        }


        const res = await fetch(
          `/api/products?${params.toString()}`
        );


        const data = await res.json();


        setFilteredProducts(data);


      } catch {

        setFilteredProducts([]);

      } finally {

        setLoading(false);

      }

    }, 500);


    return () => clearTimeout(timeout);


  }, [search, category]);



  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row">

        <div className="relative max-w-md flex-1">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />


          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="pl-10"
          />

        </div>


        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="rounded-md border px-3 py-2"
        >

          {categories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}

        </select>


      </div>


      {loading && (
        <p className="mb-4 text-sm text-muted-foreground">
          Loading products...
        </p>
      )}


      <ProductsGrid products={filteredProducts} />

    </>
  );
}