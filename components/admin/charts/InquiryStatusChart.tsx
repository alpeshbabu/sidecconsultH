"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface StatusDataPoint {
  name: string;
  value: number;
}

interface InquiryStatusChartProps {
  data: StatusDataPoint[];
}

const STATUS_COLORS: Record<string, string> = {
  New: "var(--color-signal)",
  "In Progress": "var(--color-primary)",
  Responded: "var(--color-chart-4)",
  Archived: "var(--color-muted-foreground)",
};

export function InquiryStatusChart({ data }: InquiryStatusChartProps) {
  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div className="flex items-center justify-center h-[200px] font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
        No inquiry data yet
      </div>
    );
  }

  // Filter out zero-value entries
  const filteredData = data.filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={75}
          paddingAngle={3}
          dataKey="value"
        >
          {filteredData.map((entry) => (
            <Cell
              key={entry.name}
              fill={STATUS_COLORS[entry.name] || "var(--color-chart-2)"}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-hairline)",
            borderRadius: "0px",
            color: "var(--color-card-foreground)",
            fontSize: "12px",
            fontFamily: "var(--font-mono)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
