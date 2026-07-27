"use client";

import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export default function AdminPage() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const [products, setProducts] = useState<any[]>([]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  async function fetchProducts() {

    try {

      const res = await fetch("/api/products");

      const data = await res.json();

      setProducts(data);

    } catch {

      console.log("Failed to fetch products");

    }

  }


  useEffect(() => {

    fetchProducts();

  }, []);



  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);
    setMessage("");


    try {

      const res = await fetch("/api/products", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          description,
          price,
          image,
          category,
        }),

      });


      const data = await res.json();


      if (!res.ok) {

        setMessage(
          data.message || "Failed to create product"
        );

        return;

      }


      setMessage("Product created successfully");


      setName("");
      setDescription("");
      setPrice("");
      setImage("");
      setCategory("");


      // rifreskon listën
      fetchProducts();


    } catch {

      setMessage("Something went wrong");


    } finally {

      setLoading(false);

    }

  }

  async function deleteProduct(id: string) {

  try {

    const res = await fetch("/api/products", {

      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id,
      }),

    });


    if (res.ok) {
      fetchProducts();
    }


  } catch {

    console.log("Delete failed");

  }

}

  return (

    <div className="min-h-screen flex flex-col items-center p-6">


      <Card className="w-full max-w-lg">


        <CardHeader>

          <CardTitle>
            Admin - Add Product
          </CardTitle>

        </CardHeader>


        <CardContent>


          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >


            <Input
              placeholder="Product name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />


            <Input
              placeholder="Description"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
            />


            <Input
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e)=>setPrice(e.target.value)}
            />


            <Input
              placeholder="Image URL"
              value={image}
              onChange={(e)=>setImage(e.target.value)}
            />


            <Input
              placeholder="Category"
              value={category}
              onChange={(e)=>setCategory(e.target.value)}
            />


            <Button
              className="w-full"
              disabled={loading}
            >

              {loading ? "Adding..." : "Add Product"}

            </Button>



            {message && (

              <p className="text-center text-sm">
                {message}
              </p>

            )}


          </form>


        </CardContent>


      </Card>



      {/* PRODUCTS LIST */}


      <div className="w-full max-w-lg mt-10">


        <h2 className="text-xl font-bold mb-4">
          Existing Products
        </h2>



        <div className="space-y-4">


          {products.map((product)=> (

            <Card key={product.id}>


              <CardContent className="p-4 flex justify-between items-center">


                <div>

                  <h3 className="font-semibold">
                    {product.name}
                  </h3>


                  <p>
                    ${product.price}
                  </p>


                  <p className="text-sm text-muted-foreground">
                    {product.category}
                  </p>


                </div>



                <Button
                   variant="destructive"
                      onClick={() => deleteProduct(product.id)}
                      >
                          Delete
                 </Button>


              </CardContent>


            </Card>

          ))}


        </div>


      </div>



    </div>

  );
}