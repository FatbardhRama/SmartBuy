import ProductsClient from "@/components/products/ProductsClient";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Products
      </h1>

      <ProductsClient products={products} />
    </div>
  );
}