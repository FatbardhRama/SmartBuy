"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toastError, toastSuccess } from "@/components/ui/toast";

type ProductForm = {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  stock: string;
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "0",
};

export function SellerProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(Boolean(productId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) return;

    let active = true;
    async function loadProduct() {
      try {
        const response = await fetch(`/api/seller/products/${productId}`);
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.message ?? "Unable to load this product.");
        if (active) {
          setForm({
            name: data.name,
            description: data.description,
            price: String(data.price),
            category: data.category,
            image: data.image,
            stock: String(data.stock),
          });
        }
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : "Unable to load this product.";
        if (active) setError(message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();
    return () => { active = false; };
  }, [productId]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        productId ? `/api/seller/products/${productId}` : "/api/seller/products",
        {
          method: productId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message ?? "Unable to save the product.");

      toastSuccess(productId ? "Product updated successfully." : "Product created successfully.");
      router.push("/seller/products");
      router.refresh();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Unable to save the product.";
      setError(message);
      toastError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-5" aria-busy="true" aria-label="Loading product form">
        <div className="space-y-2"><div className="h-4 w-16 animate-pulse rounded bg-muted" /><div className="h-8 w-full animate-pulse rounded-lg bg-muted" /></div>
        <div className="space-y-2"><div className="h-4 w-24 animate-pulse rounded bg-muted" /><div className="h-20 w-full animate-pulse rounded-lg bg-muted" /></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="h-8 animate-pulse rounded-lg bg-muted" />
          <div className="h-8 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="h-8 w-full animate-pulse rounded-lg bg-muted" />
        <span className="sr-only" role="status">Loading product…</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" value={form.name} onChange={handleChange} required /></div>
      <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={form.description} onChange={handleChange} required /></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="price">Price</Label><Input id="price" name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={handleChange} required /></div>
        <div className="space-y-2"><Label htmlFor="stock">Stock</Label><Input id="stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} required /></div>
      </div>
      <div className="space-y-2"><Label htmlFor="category">Category</Label><Input id="category" name="category" value={form.category} onChange={handleChange} required /></div>
      <div className="space-y-2"><Label htmlFor="image">Image URL</Label><Input id="image" name="image" type="url" value={form.image} onChange={handleChange} required /></div>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      <Button type="submit" disabled={saving}>{saving ? "Saving..." : productId ? "Update Product" : "Create Product"}</Button>
    </form>
  );
}
