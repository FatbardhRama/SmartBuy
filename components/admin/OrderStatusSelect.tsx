"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  orderId: string;
  currentStatus: string;
};

const statuses = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: Props) {
  const router = useRouter();

  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);

    const res = await fetch(
      `/api/admin/orders/${orderId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    if (res.ok) {
      setStatus(newStatus);
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
      <select
        value={status}
        disabled={loading}
        onChange={(e) => updateStatus(e.target.value)}
        className="h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm font-semibold capitalize outline-none transition-[border-color,box-shadow] focus:border-primary focus:ring-3 focus:ring-primary/15 disabled:cursor-wait disabled:opacity-60"
        aria-label={`Update status for order ${orderId}`}
      >
        {statuses.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item.charAt(0) + item.slice(1).toLowerCase()}
          </option>
        ))}
      </select>

      {loading && (
        <span className="text-xs text-muted-foreground" role="status">
          Saving...
        </span>
      )}
    </div>
  );
}
