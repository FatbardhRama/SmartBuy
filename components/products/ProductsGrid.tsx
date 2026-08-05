"use client";

import { ProductCard } from "./ProductCard";

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

type ProductsGridProps = {
  products: Product[];
};

export default function ProductsGrid({
  products,
}: ProductsGridProps) {
  return (
    <ul className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6" aria-label="Products">
      {products.map((product) => (
        <li key={product.id} className="h-full">
          <ProductCard {...product} />
        </li>
      ))}
    </ul>
  );
}
