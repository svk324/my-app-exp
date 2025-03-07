// components/charts/income-chart.tsx
"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface IncomeChartProps {
  data: Record<string, number>;
}

const COLORS = ["#10b981", "#3b82f6", "#6366f1", "#8b5cf6"];

const CATEGORY_LABELS: Record<string, string> = {
  STARTUP: "Startup",
  JOB: "Job",
  FREELANCE: "Freelance",
  SOCIAL_MEDIA: "Social Media",
};

export function IncomeChart({ data }: IncomeChartProps) {
  const chartData = Object.entries(data).map(([category, amount]) => ({
    name: CATEGORY_LABELS[category] || category,
    value: amount,
  }));

  return (
    <div className="w-full h-80">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(value)
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No income data to display</p>
        </div>
      )}
    </div>
  );
}
