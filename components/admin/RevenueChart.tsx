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
import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

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
      <EmptyState icon={<BarChart3 className="size-6" />} title="No revenue data yet" description="Revenue trends will appear after completed orders are recorded." />
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
            stroke="var(--primary)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
