"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "next/navigation";


export default function ProductDetailsPage() {

  const params = useParams();

  const id = params.id as string;


  const [product, setProduct] = useState<any>(null);

  const [loading, setLoading] = useState(true);



  async function fetchProduct() {

    try {

      const res = await fetch(`/api/products/${id}`);

      const data = await res.json();
      console.log("PRODUCT DATA:", data);

      setProduct(data);


    } catch {

      console.log("Failed to fetch product");


    } finally {

      setLoading(false);

    }

  }



  useEffect(() => {

    if (id) {
      fetchProduct();
    }

  }, [id]);




  if (loading) {

    return (

      <div className="flex justify-center p-10">

        Loading...

      </div>

    );

  }




  if (!product) {

    return (

      <div className="flex justify-center p-10">

        Product not found

      </div>

    );

  }





  return (

    <div className="min-h-screen flex items-center justify-center p-6">


      <Card className="w-full max-w-xl">


        <CardHeader>


          <CardTitle className="text-2xl">

            {product.name}

          </CardTitle>


        </CardHeader>



        <CardContent className="space-y-4">



          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg"
          />



          <p className="text-lg">

            {product.description}

          </p>



          <p className="text-xl font-bold">

            ${product.price}

          </p>



          <p className="text-sm text-muted-foreground">

            Category: {product.category}

          </p>




          <Button className="w-full">

            Add to Cart

          </Button>



        </CardContent>


      </Card>


    </div>

  );

}