import type { Metadata } from "next";
import { Suspense } from "react";
import { AppointmentsContent } from "./AppointmentsContent";

export const metadata: Metadata = {
  title: "Appointments",
  description: "Manage appointment slots and bookings",
};

export default function AdminAppointmentsPage() {
  return (
    <Suspense fallback={<AppointmentsLoading />}>
      <AppointmentsContent />
    </Suspense>
  );
}

function AppointmentsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-muted animate-pulse rounded" />
        <div className="h-10 w-28 bg-muted animate-pulse rounded" />
      </div>
      <div className="h-56 bg-muted animate-pulse rounded-lg" />
      <div className="h-56 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}
