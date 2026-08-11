"use client";

import { useRouter } from "next/navigation";

type Props = {
  orderId: string;
  status: string;
};

export function UpdateOrderStatus({
  orderId,
  status,
}: Props) {
  const router = useRouter();

  async function changeStatus(
    value: string
  ) {
    const res = await fetch(
      `/api/admin/orders/${orderId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          status: value,
        }),
      }
    );

    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <select
      className="h-10 rounded-xl border border-input bg-background px-3 text-sm font-semibold outline-none transition-[border-color,box-shadow] focus:border-primary focus:ring-3 focus:ring-primary/15"
      value={status}
      onChange={(e) =>
        changeStatus(e.target.value)
      }
    >
      <option value="PENDING">
        PENDING
      </option>

      <option value="PROCESSING">
        PROCESSING
      </option>

      <option value="SHIPPED">
        SHIPPED
      </option>

      <option value="DELIVERED">
        DELIVERED
      </option>

      <option value="CANCELLED">
        CANCELLED
      </option>
    </select>
  );
}
