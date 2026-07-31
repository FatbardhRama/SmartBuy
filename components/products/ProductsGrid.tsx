"use client";

import { ProductCard } from "./ProductCard";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type ProductsGridProps = {
  products: Product[];
};

export default function ProductsGrid({
  products,
}: ProductsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
        />
      ))}
    </div>
  );
}