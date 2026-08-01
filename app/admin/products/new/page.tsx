"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function NewProductPage() {

  const router = useRouter();


  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
  });


  const [loading, setLoading] = useState(false);



  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  }



  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);


    const res = await fetch(
      "/api/admin/products",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      }
    );


    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    }


    setLoading(false);
  }



  return (
    <main className="max-w-xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-8">
        Add Product
      </h1>


      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-md p-3"
        />


        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-md p-3"
        />


        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border rounded-md p-3"
        />


        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full border rounded-md p-3"
        />


        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded-md p-3"
        />

        <input
          name="stock"
          placeholder="Stock"
          type="number"
          min="0"
          value={form.stock}
          onChange={handleChange}
          className="w-full border rounded-md p-3"
        />

        <button
          disabled={loading}
          className="border rounded-md px-5 py-3"
        >

          {loading
            ? "Creating..."
            : "Create Product"}

        </button>


      </form>


    </main>
  );
}