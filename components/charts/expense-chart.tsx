// components/charts/expense-chart.tsx
"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface ExpenseChartProps {
  data: Record<string, number>;
}

const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#84cc16"];

const CATEGORY_LABELS: Record<string, string> = {
  BILLS_RECHARGE: "Bills & Recharge",
  TRAVELING: "Traveling",
  ENTERTAINMENT: "Entertainment",
  EDUCATION_COURSES: "Education & Courses",
};

export function ExpenseChart({ data }: ExpenseChartProps) {
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
          <p className="text-muted-foreground">No expense data to display</p>
        </div>
      )}
    </div>
  );
}
