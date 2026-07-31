import ProductsClient from "@/components/products/ProductsClient";


type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};


type ProductsResponse = {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
};



async function getProducts(): Promise<ProductsResponse> {

  const res = await fetch(
    "http://localhost:3000/api/products",
    {
      cache: "no-store",
    }
  );


  if (!res.ok) {
    throw new Error(
      "Failed to fetch products"
    );
  }


  return res.json();

}




export default async function ProductsPage() {


  const data = await getProducts();



  return (

    <div className="container mx-auto px-6 py-10">


      <h1 className="mb-8 text-4xl font-bold">
        Products
      </h1>



      <ProductsClient

        products={data.products}

        initialTotalPages={data.totalPages}

      />


    </div>

  );

}