"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/formatCurrency";

type RevenueData = {
  month: string;
  revenue: number;
};

type RevenueChartProps = {
  data: RevenueData[];
};

export function RevenueChart({
  data,
}: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-sm text-gray-500">
        No revenue data available.
      </div>
    );
  }

  return (
    <div className="h-80 w-full rounded-lg border p-4">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis
            tickFormatter={(value) =>
              formatCurrency(Number(value))
            }
          />

          <Tooltip
            formatter={(value) =>
              formatCurrency(Number(value))
            }
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
