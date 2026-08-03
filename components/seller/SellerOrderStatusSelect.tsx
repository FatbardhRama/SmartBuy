"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toastError, toastSuccess } from "@/components/ui/toast";

const statuses = ["PROCESSING", "SHIPPED", "DELIVERED"] as const;

export function SellerOrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function updateStatus(nextStatus: string) {
    const previousStatus = status;
    setStatus(nextStatus);
    setSaving(true);
    try {
      const response = await fetch(`/api/seller/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message ?? "Unable to update order status.");
      toastSuccess("Order status updated.");
      router.refresh();
    } catch (error) {
      setStatus(previousStatus);
      toastError(error instanceof Error ? error.message : "Unable to update order status.");
    } finally {
      setSaving(false);
    }
  }

  const options: readonly string[] = statuses.includes(status as (typeof statuses)[number])
    ? statuses
    : [status, ...statuses];

  return (
    <select
      value={status}
      disabled={saving || status === "DELIVERED" || status === "CANCELLED"}
      onChange={(event) => updateStatus(event.target.value)}
      className="rounded-md border bg-background px-3 py-2 text-sm"
      aria-label="Update order status"
    >
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}
