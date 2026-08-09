"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "@/components/ui/toast";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


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
    <main className="mx-auto w-full max-w-3xl px-6 pb-20 pt-10 sm:pb-24 sm:pt-12">
      <Link href="/admin/products" className="mb-6 inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"><ArrowLeft className="size-4" /> Back to products</Link>
      <div className="mb-8"><p className="text-sm font-semibold text-primary">Catalog administration</p><h1 className="mt-3 text-4xl font-bold tracking-[-0.04em]">Add product</h1><p className="mt-3 text-muted-foreground">Create a new product listing for the SmartBuy catalog.</p></div>
      <Card className="overflow-hidden rounded-[1.5rem] border-0 shadow-[0_16px_42px_-30px_rgba(15,23,42,0.4)] ring-1 ring-border/80">
        <CardHeader className="border-b border-border/70 pb-5"><CardTitle>Product information</CardTitle></CardHeader>
        <CardContent className="pt-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2"><Label htmlFor="name">Product name</Label><Input id="name" name="name" placeholder="Product name" value={form.name} onChange={handleChange} className="h-11 rounded-xl bg-background" /></div>
            <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" placeholder="Describe the product and its main features" value={form.description} onChange={handleChange} className="min-h-28 rounded-xl bg-background" /></div>
            <div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="price">Price</Label><Input id="price" name="price" placeholder="0.00" value={form.price} onChange={handleChange} className="h-11 rounded-xl bg-background" /></div><div className="space-y-2"><Label htmlFor="stock">Stock</Label><Input id="stock" name="stock" placeholder="0" type="number" min="0" value={form.stock} onChange={handleChange} className="h-11 rounded-xl bg-background" /></div></div>
            <div className="space-y-2"><Label htmlFor="image">Image URL</Label><Input id="image" name="image" placeholder="https://..." value={form.image} onChange={handleChange} className="h-11 rounded-xl bg-background" /></div>
            <div className="space-y-2"><Label htmlFor="category">Category</Label><Input id="category" name="category" placeholder="Product category" value={form.category} onChange={handleChange} className="h-11 rounded-xl bg-background" /></div>
            {error && <p className="rounded-xl bg-destructive/8 p-3 text-sm text-destructive" role="alert">{error}</p>}
            <div className="flex justify-end border-t border-border/70 pt-6"><Button disabled={loading} className="h-11 w-full gap-2 rounded-xl sm:w-auto"><Plus className="size-4" />{loading ? "Creating..." : "Create product"}</Button></div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
