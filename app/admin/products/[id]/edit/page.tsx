"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toastError, toastSuccess } from "@/components/ui/toast";
import { ProductFormSkeleton } from "@/components/admin/ProductFormSkeleton";


export default function EditProductPage() {

  const params = useParams();
  const router = useRouter();


  const id = params.id as string;


  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
  });


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");



  useEffect(() => {

    async function fetchProduct() {

      const res = await fetch(
        `/api/admin/products/${id}`
      );


      if (!res.ok) {
        return;
      }


      const product = await res.json();


      setForm({
        name: product.name,
        description: product.description,
        price: String(product.price),
        image: product.image,
        category: product.category,
        stock: String(product.stock ?? 0),
      });


      setLoading(false);

    }


    fetchProduct();

  }, [id]);




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
    setSaving(true);


    const res = await fetch(
      `/api/admin/products/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      }
    );


    if (res.ok) {
      toastSuccess("Product updated successfully.");
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.message || "Unable to update the product right now.");
      toastError(data?.message || "Unable to update the product right now.");
    }


    setSaving(false);

  }




  if (loading) {
    return <ProductFormSkeleton />;

  }




  return (
    <main className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-10">

      <h1 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">
        Edit Product
      </h1>


      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >


        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product name"
          className="w-full border rounded-md p-3"
        />



        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border rounded-md p-3"
        />



        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border rounded-md p-3"
        />



        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border rounded-md p-3"
        />



        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border rounded-md p-3"
        />

        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          type="number"
          min="0"
          className="w-full border rounded-md p-3"
        />

        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

        <button
          disabled={saving}
          className="min-h-11 w-full rounded-md border px-5 py-3 sm:w-auto"
        >

          {saving
            ? "Saving..."
            : "Update Product"}

        </button>


      </form>


    </main>
  );
}
