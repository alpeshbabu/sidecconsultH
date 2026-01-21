import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const blockSlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  reason: z.string().optional(),
  // For admin booking on behalf of client
  bookingType: z.enum(["BLOCKED", "ADMIN"]).default("BLOCKED"),
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional().or(z.literal("")), // Allow empty string
  clientPhone: z.string().optional(),
  serviceInterest: z.string().optional(),
});

const bulkBlockSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  reason: z.string().optional(),
});

// Default business timezone
const DEFAULT_TIMEZONE = "America/New_York";

function getTimezoneOffsetHours(timezone: string, year: number, month: number, day: number): number {
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const utcFormatter = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", hour: "numeric", hour12: false });
  const tzFormatter = new Intl.DateTimeFormat("en-US", { timeZone: timezone, hour: "numeric", hour12: false });
  const utcHour = parseInt(utcFormatter.format(date), 10);
  const tzHour = parseInt(tzFormatter.format(date), 10);
  let offset = utcHour - tzHour;
  if (offset < -12) offset += 24;
  if (offset > 12) offset -= 24;
  return offset;
}

// POST /api/admin/appointments/block - Block a single slot or book on behalf of client
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = blockSlotSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { date, startTime, endTime, reason, bookingType, clientName, clientEmail, clientPhone, serviceInterest } = parsed.data;

    // Fetch timezone from settings
    const settings = await prisma.availabilitySettings.findUnique({ where: { id: "default" } });
    const timezone = settings?.timezone || DEFAULT_TIMEZONE;
    const slotDuration = settings?.slotDurationMinutes || 30;

    // Parse date and time
    const [year, month, day] = date.split("-").map(Number);
    const [startHour, startMin] = startTime.split(":").map(Number);
    
    // Calculate end time
    let endHour: number, endMin: number;
    if (endTime) {
      [endHour, endMin] = endTime.split(":").map(Number);
    } else {
      // Default to slot duration
      const endMinutes = startHour * 60 + startMin + slotDuration;
      endHour = Math.floor(endMinutes / 60);
      endMin = endMinutes % 60;
    }

    // Convert to UTC
    const offsetHours = getTimezoneOffsetHours(timezone, year, month, day);
    const bookedAt = new Date(Date.UTC(year, month - 1, day, startHour + offsetHours, startMin, 0, 0));
    const bookedEndAt = new Date(Date.UTC(year, month - 1, day, endHour + offsetHours, endMin, 0, 0));

    // Check if slot is already booked
    const existing = await prisma.appointment.findFirst({
      where: {
        bookedAt: { gte: bookedAt, lt: bookedEndAt },
        status: { not: "CANCELLED" },
      },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "This time slot is already booked" }, { status: 409 });
    }

    // Create the appointment/block
    const appointment = await prisma.appointment.create({
      data: {
        bookedAt,
        bookedEndAt,
        bookingType: bookingType as "BLOCKED" | "ADMIN",
        name: bookingType === "BLOCKED" ? "BLOCKED" : (clientName || "Admin Booking"),
        email: bookingType === "BLOCKED" ? "blocked@internal" : (clientEmail || "admin@internal"),
        phone: clientPhone,
        serviceInterest,
        notes: reason,
        status: bookingType === "BLOCKED" ? "CONFIRMED" : "CONFIRMED",
        timeZone: timezone,
      },
    });

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error("Error blocking slot:", error);
    return NextResponse.json({ success: false, error: "Failed to block slot" }, { status: 500 });
  }
}

// PUT /api/admin/appointments/block - Bulk block slots for a date range
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = bulkBlockSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { startDate, endDate, startTime, endTime, reason } = parsed.data;

    // Fetch timezone from settings
    const settings = await prisma.availabilitySettings.findUnique({ where: { id: "default" } });
    const timezone = settings?.timezone || DEFAULT_TIMEZONE;
    const slotDuration = settings?.slotDurationMinutes || 30;

    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const created: string[] = [];
    const skipped: string[] = [];

    // Loop through each day
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const offsetHours = getTimezoneOffsetHours(timezone, year, month, day);

      // Generate slots for this day
      let currentMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      while (currentMinutes < endMinutes) {
        const slotStartHour = Math.floor(currentMinutes / 60);
        const slotStartMin = currentMinutes % 60;
        const slotEndMinutes = currentMinutes + slotDuration;
        const slotEndHour = Math.floor(slotEndMinutes / 60);
        const slotEndMin = slotEndMinutes % 60;

        const bookedAt = new Date(Date.UTC(year, month - 1, day, slotStartHour + offsetHours, slotStartMin, 0, 0));
        const bookedEndAt = new Date(Date.UTC(year, month - 1, day, slotEndHour + offsetHours, slotEndMin, 0, 0));

        // Check if slot is already booked
        const existing = await prisma.appointment.findFirst({
          where: {
            bookedAt: { gte: bookedAt, lt: bookedEndAt },
            status: { not: "CANCELLED" },
          },
        });

        if (existing) {
          skipped.push(`${dateKey} ${startTime}`);
        } else {
          await prisma.appointment.create({
            data: {
              bookedAt,
              bookedEndAt,
              bookingType: "BLOCKED",
              name: "BLOCKED",
              email: "blocked@internal",
              notes: reason,
              status: "CONFIRMED",
              timeZone: timezone,
            },
          });
          created.push(`${dateKey} ${String(slotStartHour).padStart(2, "0")}:${String(slotStartMin).padStart(2, "0")}`);
        }

        currentMinutes += slotDuration;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        created: created.length,
        skipped: skipped.length,
        message: `Blocked ${created.length} slots, skipped ${skipped.length} already booked`,
      },
    });
  } catch (error) {
    console.error("Error bulk blocking slots:", error);
    return NextResponse.json({ success: false, error: "Failed to bulk block slots" }, { status: 500 });
  }
}
