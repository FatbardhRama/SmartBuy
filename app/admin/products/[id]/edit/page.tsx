"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


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

      router.push("/admin/products");

      router.refresh();

    }


    setSaving(false);

  }




  if (loading) {

    return (
      <main className="max-w-xl mx-auto px-6 py-10">
        Loading...
      </main>
    );

  }




  return (
    <main className="max-w-xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-8">
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

        <button
          disabled={saving}
          className="border rounded-md px-5 py-3"
        >

          {saving
            ? "Saving..."
            : "Update Product"}

        </button>


      </form>


    </main>
  );
}