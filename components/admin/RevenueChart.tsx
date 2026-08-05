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
      <EmptyState icon={<BarChart3 className="size-6" />} title="No revenue data yet" description="Revenue trends will appear after completed orders are recorded." className="shadow-none" />
    );
  }

  return (
    <div className="h-80 w-full rounded-2xl bg-card p-4 shadow-[0_16px_42px_-30px_rgba(15,23,42,0.4)] ring-1 ring-border/80 sm:h-96 sm:p-6" role="img" aria-label="Monthly revenue line chart">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart data={data}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 6" vertical={false} />

          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} dy={8} />

          <YAxis
            tickFormatter={(value) =>
              formatCurrency(Number(value))
            }
            axisLine={false}
            tickLine={false}
            width={72}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />

          <Tooltip
            formatter={(value) =>
              formatCurrency(Number(value))
            }
            contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)", background: "var(--popover)", boxShadow: "0 16px 36px -24px rgba(15,23,42,.4)" }}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--primary)"
            strokeWidth={3}
            dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
