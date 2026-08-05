"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toastError, toastSuccess } from "@/components/ui/toast";
import { Check, Pause, X } from "lucide-react";

type StoreStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

type StoreStatusActionsProps = {
  storeId: string;
  status: StoreStatus;
};

export function StoreStatusActions({ storeId, status }: StoreStatusActionsProps) {
  const router = useRouter();
  const [updatingStatus, setUpdatingStatus] = useState<StoreStatus | null>(null);
  const [error, setError] = useState("");

  async function updateStatus(nextStatus: StoreStatus) {
    setError("");
    setUpdatingStatus(nextStatus);

    try {
      const response = await fetch("/api/admin/stores", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: storeId, status: nextStatus }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = data?.message ?? "Unable to update store status.";
        setError(message);
        toastError(message);
        return;
      }

      toastSuccess(`Store status updated to ${nextStatus.toLowerCase()}.`);
      router.refresh();
    } catch {
      const message = "Unable to update store status.";
      setError(message);
      toastError(message);
    } finally {
      setUpdatingStatus(null);
    }
  }

  return (
    <div className="space-y-3 border-t border-border/70 pt-4">
      <p className="text-xs font-medium text-muted-foreground">Update store availability</p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="gap-1.5 rounded-lg" onClick={() => updateStatus("APPROVED")} disabled={updatingStatus !== null || status === "APPROVED"}>
          <Check className="size-3.5" /> {updatingStatus === "APPROVED" ? "Approving..." : "Approve"}
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5 rounded-lg" onClick={() => updateStatus("REJECTED")} disabled={updatingStatus !== null || status === "REJECTED"}>
          <X className="size-3.5" /> {updatingStatus === "REJECTED" ? "Rejecting..." : "Reject"}
        </Button>
        <Button size="sm" variant="destructive" className="gap-1.5 rounded-lg" onClick={() => updateStatus("SUSPENDED")} disabled={updatingStatus !== null || status === "SUSPENDED"}>
          <Pause className="size-3.5" /> {updatingStatus === "SUSPENDED" ? "Suspending..." : "Suspend"}
        </Button>
      </div>
      {error && <p className="rounded-xl bg-destructive/5 p-3 text-sm text-destructive" role="alert">{error}</p>}
    </div>
  );
}
