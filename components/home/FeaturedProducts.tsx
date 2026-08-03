import { ProductCard } from "@/components/products/ProductCard";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type FeaturedProductsProps = {
  products: Product[];
};

export function FeaturedProducts({
  products,
}: FeaturedProductsProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">

        <h2 className="mb-8 text-3xl font-bold">
          Featured Products
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}

        </div>

      </div>
    </section>
  );
}
