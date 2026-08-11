"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toastError, toastSuccess } from "@/components/ui/toast";
import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  productId: string;
};

export function DeleteProductButton({
  productId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/admin/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        toastSuccess("Product deleted successfully.");
        router.refresh();
      } else {
        toastError("Unable to delete this product right now.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog>

      <AlertDialogTrigger
  render={
    <Button variant="destructive" size="sm" className="gap-1.5 rounded-lg">
      <Trash2 className="size-3.5" /> Delete
    </Button>
  }
/>

      <AlertDialogContent className="rounded-2xl">

        <AlertDialogHeader>

          <AlertDialogTitle>
            Delete product?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. The product will be permanently removed from the catalog.
          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  );
}
