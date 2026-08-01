"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toastError, toastSuccess } from "@/components/ui/toast";

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
    <Button variant="destructive">
      Delete
    </Button>
  }
/>

      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>
            Delete Product?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone.
            The product will be permanently removed.
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