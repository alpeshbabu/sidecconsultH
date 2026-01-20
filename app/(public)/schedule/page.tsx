"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { MainLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SERVICE_INTEREST_OPTIONS } from "@/lib/constants";

interface Slot {
  id: string;
  startAt: string;
  endAt: string;
  isBooked: boolean;
}

const formatTimeLabel = (value: string) =>
  new Date(value).toLocaleTimeString(undefined, { timeStyle: "short" });

const getMonthLabel = (value: Date) =>
  value.toLocaleDateString(undefined, { month: "long", year: "numeric" });

const toLocalDateKey = (value: Date) =>
  value.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

const getMonthDays = (value: Date) => {
  const year = value.getFullYear();
  const month = value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];

  const startOffset = firstDay.getDay();
  for (let i = 0; i < startOffset; i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
};

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(() => toLocalDateKey(new Date()));
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    serviceInterest: "",
    notes: "",
  });

  const timeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );

  const todayKey = useMemo(() => toLocalDateKey(new Date()), []);
  const calendarDays = useMemo(() => getMonthDays(calendarMonth), [calendarMonth]);

  // Fetch slots when date changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setSelectedSlot(null);
      try {
        const response = await fetch(`/api/appointments/slots?date=${selectedDate}`);
        const data = await response.json();
        if (data.success) {
          setSlots(data.data.slots || []);
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
        setSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  const availableSlots = useMemo(() => slots.filter((s) => !s.isBooked), [slots]);
  const bookedSlots = useMemo(() => slots.filter((s) => s.isBooked), [slots]);

  const submitBooking = async () => {
    if (!selectedSlot) {
      toast.error("Please select an available time slot.");
      return;
    }
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    const slotTime = new Date(selectedSlot.startAt);
    const time = `${slotTime.getHours().toString().padStart(2, "0")}:${slotTime.getMinutes().toString().padStart(2, "0")}`;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          time,
          ...formData,
          timeZone,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to book appointment");
      }

      setIsSubmitted(true);
      toast.success("Appointment request submitted!", {
        description: "We'll confirm your slot by email shortly.",
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Unable to book appointment.", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const prevMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
    );
  };

  return (
    <MainLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1.5 border-primary/30 bg-primary/5"
            >
              <Calendar className="h-3.5 w-3.5 mr-2 text-primary" />
              Schedule a Consultation
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Book a Time That Works for You
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Select an available time slot and share a few details so we can
              prepare for your discovery call.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Calendar & Slots */}
            <Card>
              <CardHeader>
                <CardTitle>Choose a Time Slot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calendar */}
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    Pick a date
                  </p>
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between mb-4">
                      <Button variant="ghost" size="sm" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <p className="text-sm font-semibold">
                        {getMonthLabel(calendarMonth)}
                      </p>
                      <Button variant="ghost" size="sm" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground mb-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <div key={day} className="text-center py-1">
                            {day}
                          </div>
                        )
                      )}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, index) => {
                        if (!day) {
                          return <div key={`empty-${index}`} className="h-10" />;
                        }
                        const dateKey = toLocalDateKey(day);
                        const isSelected = selectedDate === dateKey;
                        const isPast = dateKey < todayKey;
                        const isToday = dateKey === todayKey;

                        return (
                          <button
                            key={dateKey}
                            type="button"
                            disabled={isPast}
                            onClick={() => setSelectedDate(dateKey)}
                            className={`h-10 rounded-md text-sm font-medium transition-colors ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : isToday
                                ? "bg-primary/10 text-primary"
                                : isPast
                                ? "text-muted-foreground/40 cursor-not-allowed"
                                : "hover:bg-muted"
                            }`}
                          >
                            {day.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                    Pick a time
                  </p>
                  {isLoadingSlots ? (
                    <div className="h-32 rounded-lg bg-muted animate-pulse" />
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                      No availability for this date.
                    </p>
                  ) : (
                    <>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {slots.map((slot) => {
                          const isBooked = slot.isBooked;
                          const isSelected = selectedSlot?.id === slot.id;

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={isBooked}
                              onClick={() => setSelectedSlot(slot)}
                              className={`flex items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                                isBooked
                                  ? "bg-muted text-muted-foreground/50 cursor-not-allowed line-through"
                                  : isSelected
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              }`}
                            >
                              {formatTimeLabel(slot.startAt)}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          Available: {availableSlots.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                          Booked: {bookedSlots.length}
                        </span>
                      </div>
                    </>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    Time zone: {timeZone}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isSubmitted ? (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                    <h3 className="mt-4 text-lg font-semibold text-green-900">
                      Appointment Requested!
                    </h3>
                    <p className="mt-2 text-sm text-green-700">
                      We'll send a confirmation email shortly.
                    </p>
                    <Button
                      className="mt-4"
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false);
                        setSelectedSlot(null);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          companyName: "",
                          serviceInterest: "",
                          notes: "",
                        });
                      }}
                    >
                      Book Another
                    </Button>
                  </div>
                ) : (
                  <>
                    {selectedSlot && (
                      <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
                        <p className="font-medium">
                          Selected:{" "}
                          {new Date(selectedSlot.startAt).toLocaleDateString(
                            undefined,
                            { dateStyle: "full" }
                          )}{" "}
                          at {formatTimeLabel(selectedSlot.startAt)}
                        </p>
                      </div>
                    )}

                    <Input
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                    <Input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                    <Input
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                    <Input
                      placeholder="Company Name"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          companyName: e.target.value,
                        }))
                      }
                    />
                    <Select
                      value={formData.serviceInterest}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          serviceInterest: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Service Interest" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_INTEREST_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Tell us about your project or questions..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={submitBooking}
                      disabled={isSubmitting || !selectedSlot}
                    >
                      {isSubmitting ? "Booking..." : "Request Appointment"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Alternative CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Prefer to submit an inquiry instead?
            </p>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                <MessageSquare className="mr-2 h-4 w-4" />
                Submit an Inquiry
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
