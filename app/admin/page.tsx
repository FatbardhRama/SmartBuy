"use client";

import { useState } from "react";

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

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


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
        setMessage(data.message || "Failed to create product");
        return;
      }


      setMessage("Product created successfully");


      setName("");
      setDescription("");
      setPrice("");
      setImage("");
      setCategory("");


    } catch {

      setMessage("Something went wrong");

    } finally {

      setLoading(false);

    }

  }


  return (

    <div className="min-h-screen flex items-center justify-center p-6">

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

    </div>

  );
}