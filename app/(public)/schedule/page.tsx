"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
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
import { SERVICE_INTEREST_OPTIONS } from "@/lib/constants";

interface Slot {
  id: string;
  startAt: string;
  endAt: string;
  isBooked: boolean;
  localTime?: string; // Pre-formatted time in the business timezone
}

interface SlotSettings {
  timezone: string;
  timezoneLabel: string;
  timezoneAbbreviation?: string;
}

// Slot times are authoritative in the business timezone (sent pre-formatted by the API).
const formatTimeLabel = (slot: Slot) =>
  slot.localTime || new Date(slot.startAt).toLocaleTimeString(undefined, { timeStyle: "short" });

// The same instant rendered on the visitor's own clock — shown when their
// timezone differs from the business timezone so there's no ambiguity.
const formatVisitorTime = (slot: Slot) => {
  const date = new Date(slot.startAt);
  const time = date.toLocaleTimeString(undefined, { timeStyle: "short" });
  const abbr = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    timeZoneName: "short",
  })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")?.value;
  return abbr ? `${time} ${abbr}` : time;
};

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
  const [slotSettings, setSlotSettings] = useState<SlotSettings | null>(null);
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
          if (data.data.settings) setSlotSettings(data.data.settings);
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

  // Show the visitor's local equivalent only when their timezone differs from
  // the business timezone the slots are expressed in.
  const showVisitorTime = useMemo(
    () => Boolean(slotSettings && slotSettings.timezone !== timeZone),
    [slotSettings, timeZone]
  );
  const businessTzLabel = slotSettings
    ? `${slotSettings.timezoneLabel}${
        slotSettings.timezoneAbbreviation
          ? ` (${slotSettings.timezoneAbbreviation})`
          : ""
      }`
    : "the business time zone";

  const submitBooking = async () => {
    if (!selectedSlot) {
      toast.error("Please select an available time slot.");
      return;
    }

    // Trim everything up front — the server validates the raw values, so a stray
    // space in the email (or a 1-character name) would otherwise be rejected.
    const name = formData.name.trim();
    const email = formData.email.trim();

    if (name.length < 2) {
      toast.error("Please enter your full name (at least 2 characters).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Send the canonical UTC instants from the slot itself so validation
          // never depends on the visitor's browser timezone.
          startAt: selectedSlot.startAt,
          endAt: selectedSlot.endAt,
          date: selectedDate,
          name,
          email,
          phone: formData.phone.trim() || undefined,
          companyName: formData.companyName.trim() || undefined,
          serviceInterest: formData.serviceInterest || undefined,
          notes: formData.notes.trim() || undefined,
          timeZone,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        // Surface per-field validation errors instead of a generic message.
        const fieldErrors = result.details
          ? Object.values(result.details as Record<string, string[]>)
              .flat()
              .filter(Boolean)
          : [];
        throw new Error(
          fieldErrors.length
            ? fieldErrors.join(" ")
            : result.error || "Failed to book appointment"
        );
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
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="grid-blueprint absolute inset-0 opacity-70" />
          <div className="absolute inset-x-0 top-0 h-px bg-signal/40" />
        </div>
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-5 justify-center">Schedule a Consultation</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Book a time that{" "}
              <span className="text-signal">works for you</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Select an available time slot and share a few details so we can
              prepare for your discovery call.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding hairline-t">
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Calendar & Slots */}
            <Card className="card-technical rounded-none">
              <CardHeader>
                <CardTitle className="font-display">Choose a Time Slot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calendar */}
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mb-2">
                    Pick a date
                  </p>
                  <div className="rounded-sm border border-hairline bg-card p-4">
                    <div className="flex items-center justify-between mb-4">
                      <Button variant="ghost" size="sm" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <p className="font-mono text-sm font-medium tracking-wide">
                        {getMonthLabel(calendarMonth)}
                      </p>
                      <Button variant="ghost" size="sm" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-2">
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
                            className={`h-10 rounded-sm border border-hairline font-mono text-xs transition-colors ${
                              isSelected
                                ? "border-signal bg-signal text-signal-foreground"
                                : isToday
                                ? "border-signal/40 bg-signal/10 text-foreground"
                                : isPast
                                ? "border-transparent text-muted-foreground/40 cursor-not-allowed"
                                : "hover:border-signal/60"
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
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                      Pick a time
                    </p>
                    <span className="rounded-sm border border-signal/40 bg-signal/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-foreground">
                      Times in {businessTzLabel}
                    </span>
                  </div>
                  {isLoadingSlots ? (
                    <div className="h-32 rounded-sm bg-muted animate-pulse" />
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
                              className={`flex items-center justify-center rounded-sm border border-hairline px-3 py-2.5 font-mono text-xs transition-colors ${
                                isBooked
                                  ? "bg-muted text-muted-foreground/50 cursor-not-allowed line-through"
                                  : isSelected
                                  ? "border-signal bg-signal text-signal-foreground"
                                  : "hover:border-signal/60"
                              }`}
                            >
                              {formatTimeLabel(slot)}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-3 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-signal" />
                          Available: {availableSlots.length}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                          Booked: {bookedSlots.length}
                        </span>
                      </div>
                    </>
                  )}
                  {showVisitorTime && (
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                      Your time zone is {timeZone} — your local time is shown once
                      you select a slot.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card className="card-technical rounded-none">
              <CardHeader>
                <CardTitle className="font-display">Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isSubmitted ? (
                  <div className="rounded-sm border border-hairline bg-signal/5 p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center border border-hairline text-signal">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold">
                      Appointment Requested!
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
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
                      <div className="rounded-sm border border-signal/40 bg-signal/10 p-3 text-sm">
                        <p className="font-medium">
                          Selected:{" "}
                          {new Date(selectedSlot.startAt).toLocaleDateString(
                            undefined,
                            { dateStyle: "full" }
                          )}{" "}
                          at {formatTimeLabel(selectedSlot)} {businessTzLabel}
                        </p>
                        {showVisitorTime && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            That&apos;s {formatVisitorTime(selectedSlot)} in your
                            time zone ({timeZone}).
                          </p>
                        )}
                      </div>
                    )}

                    <Input
                      placeholder="Full Name *"
                      className="rounded-sm border-hairline focus-visible:ring-signal"
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
                      className="rounded-sm border-hairline focus-visible:ring-signal"
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
                      className="rounded-sm border-hairline focus-visible:ring-signal"
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
                      className="rounded-sm border-hairline focus-visible:ring-signal"
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
                      <SelectTrigger className="rounded-sm border-hairline focus-visible:ring-signal">
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
                      className="rounded-sm border-hairline focus-visible:ring-signal"
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
                      variant="technical"
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
            <Button
              asChild
              variant="outline"
              size="lg"
            >
              <Link href="/contact">
                <MessageSquare className="mr-2 h-4 w-4" />
                Submit an Inquiry
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
