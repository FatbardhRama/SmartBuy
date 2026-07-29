"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";


type Props = {
  productId: string;
};


export function DeleteProductButton({
  productId,
}: Props) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);



  async function handleDelete() {

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );


    if (!confirmed) {
      return;
    }


    setLoading(true);


    const res = await fetch(
      `/api/admin/products/${productId}`,
      {
        method: "DELETE",
      }
    );


    if (res.ok) {

      router.refresh();

    }


    setLoading(false);

  }



  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="border rounded-md px-4 py-2 text-red-600"
    >

      {loading
        ? "Deleting..."
        : "Delete"}

    </button>
  );
}