"use client";

interface ConversionFunnelProps {
  totalInquiries: number;
  respondedInquiries: number;
  totalAppointments: number;
}

export function ConversionFunnel({
  totalInquiries,
  respondedInquiries,
  totalAppointments,
}: ConversionFunnelProps) {
  const steps = [
    {
      label: "Inquiries",
      value: totalInquiries,
      colorClass: "bg-[var(--color-chart-1)]",
      percentage: 100,
    },
    {
      label: "Responded",
      value: respondedInquiries,
      colorClass: "bg-[var(--color-chart-3)]",
      percentage:
        totalInquiries > 0
          ? Math.round((respondedInquiries / totalInquiries) * 100)
          : 0,
    },
    {
      label: "Appointments",
      value: totalAppointments,
      colorClass: "bg-[var(--color-chart-4)]",
      percentage:
        totalInquiries > 0
          ? Math.round((totalAppointments / totalInquiries) * 100)
          : 0,
    },
  ];

  if (totalInquiries === 0) {
    return (
      <div className="flex items-center justify-center h-[140px] text-muted-foreground text-sm">
        No conversion data yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={step.label} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{step.label}</span>
            <span className="text-muted-foreground">
              {step.value}
              {i > 0 && ` (${step.percentage}%)`}
            </span>
          </div>
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${step.colorClass} rounded-full transition-all duration-500`}
              style={{ width: `${step.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
