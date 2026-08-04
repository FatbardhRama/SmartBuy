"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "@/components/ui/toast";


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
  const [error, setError] = useState("");



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

    setError("");
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
      toastSuccess("Product created successfully.");
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.message || "Unable to create the product right now.");
      toastError(data?.message || "Unable to create the product right now.");
    }


    setLoading(false);
  }



  return (
    <main className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10">

      <h1 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
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

        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

        <button
          disabled={loading}
          className="min-h-11 w-full rounded-md border px-5 py-3 sm:w-auto"
        >

          {loading
            ? "Creating..."
            : "Create Product"}

        </button>


      </form>


    </main>
  );
}
