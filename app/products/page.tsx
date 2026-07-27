import { ProductCard } from "@/components/products/ProductCard";


async function getProducts() {

  const res = await fetch(
    "http://localhost:3000/api/products",
    {
      cache: "no-store",
    }
  );


  return res.json();
}



export default async function ProductsPage() {

  const products = await getProducts();


  return (
    <div className="container mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-8">
        Products
      </h1>


      <div className="grid gap-6 md:grid-cols-3">

        {products.map((product:any)=>(
          <ProductCard
            key={product.id}
            {...product}
          />
        ))}

      </div>

    </div>
  );
}