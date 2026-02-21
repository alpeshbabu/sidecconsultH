"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MonthlyDataPoint {
  month: string;
  label: string;
  inquiries: number;
  appointments: number;
  subscribers: number;
  chats: number;
}

interface MonthlyActivityChartProps {
  data: MonthlyDataPoint[];
}

export function MonthlyActivityChart({ data }: MonthlyActivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillInquiries" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillAppointments" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-4)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-chart-4)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillSubscribers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillChats" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-5)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-chart-5)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
          tickLine={false}
          axisLine={false}
          width={30}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            color: "var(--color-card-foreground)",
            fontSize: "12px",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Area
          type="monotone"
          dataKey="inquiries"
          name="Inquiries"
          stroke="var(--color-chart-1)"
          fill="url(#fillInquiries)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="appointments"
          name="Appointments"
          stroke="var(--color-chart-4)"
          fill="url(#fillAppointments)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="subscribers"
          name="Subscribers"
          stroke="var(--color-chart-3)"
          fill="url(#fillSubscribers)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="chats"
          name="Chats"
          stroke="var(--color-chart-5)"
          fill="url(#fillChats)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
