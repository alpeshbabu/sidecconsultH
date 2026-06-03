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
      barStyle: { backgroundColor: "var(--color-primary)" },
      percentage: 100,
    },
    {
      label: "Responded",
      value: respondedInquiries,
      barStyle: { backgroundColor: "var(--color-signal)" },
      percentage:
        totalInquiries > 0
          ? Math.round((respondedInquiries / totalInquiries) * 100)
          : 0,
    },
    {
      label: "Appointments",
      value: totalAppointments,
      barStyle: { backgroundColor: "var(--color-chart-4)" },
      percentage:
        totalInquiries > 0
          ? Math.round((totalAppointments / totalInquiries) * 100)
          : 0,
    },
  ];

  if (totalInquiries === 0) {
    return (
      <div className="flex items-center justify-center h-[140px] font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
        No conversion data yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={step.label} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {step.label}
            </span>
            <span className="font-mono text-xs text-foreground">
              {step.value}
              {i > 0 && ` (${step.percentage}%)`}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-none border border-hairline bg-muted/20">
            <div
              className="h-full transition-all duration-500"
              style={{ ...step.barStyle, width: `${step.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
