import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Business timezone - adjust this to your business location
// Common values: "America/New_York", "America/Los_Angeles", "America/Chicago"
const BUSINESS_TIMEZONE = "America/New_York";

// Helper to create a date in a specific timezone
function createDateInTimezone(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timezone: string
): Date {
  // Create a date string in the target timezone
  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  
  // Use Intl.DateTimeFormat to get the timezone offset
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  
  // Create date assuming it's in the business timezone
  // Parse in UTC then adjust for timezone offset
  const utcDate = new Date(dateStr + "Z");
  
  // Get the offset for the target timezone on this date
  const targetDate = new Date(dateStr);
  const utcParts = formatter.formatToParts(targetDate);
  
  // Calculate offset by comparing UTC to target timezone
  const tempDate = new Date(dateStr);
  const offset = tempDate.getTimezoneOffset(); // Server's offset
  
  // For Eastern Time: EST = UTC-5, EDT = UTC-4
  // We need to create a UTC time that, when displayed in Eastern, shows the desired time
  const easternOffset = getTimezoneOffset(timezone, new Date(year, month - 1, day));
  
  return new Date(Date.UTC(year, month - 1, day, hour + easternOffset / 60, minute, 0, 0));
}

// Get timezone offset in minutes for a specific timezone on a specific date
function getTimezoneOffset(timezone: string, date: Date): number {
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
  return (utcDate.getTime() - tzDate.getTime()) / (1000 * 60);
}

// GET /api/appointments/slots?date=YYYY-MM-DD
// Returns dynamically generated slots for a specific date
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    // Fetch availability settings
    let settings = await prisma.availabilitySettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = {
        id: "default",
        startTime: "08:00",
        endTime: "17:00",
        slotDurationMinutes: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const { startTime, endTime, slotDurationMinutes } = settings;
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    // If no date provided, return settings only
    if (!dateParam) {
      return NextResponse.json({
        success: true,
        data: {
          settings: {
            startTime,
            endTime,
            slotDurationMinutes,
          },
          slots: [],
        },
      });
    }

    // Parse the date
    const [year, month, day] = dateParam.split("-").map(Number);
    
    // Get timezone offset for the business timezone on this date
    const sampleDate = new Date(year, month - 1, day, 12, 0, 0);
    const tzOffset = getTimezoneOffset(BUSINESS_TIMEZONE, sampleDate);
    
    // Create start and end of day in the business timezone (converted to UTC)
    const dateStart = new Date(Date.UTC(year, month - 1, day, 0 - tzOffset / 60, 0, 0, 0));
    const dateEnd = new Date(Date.UTC(year, month - 1, day, 24 - tzOffset / 60, 0, 0, 0));

    // Fetch booked appointments for this date
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        bookedAt: {
          gte: dateStart,
          lte: dateEnd,
        },
        status: {
          not: "CANCELLED",
        },
      },
      select: {
        bookedAt: true,
      },
    });

    const bookedTimes = new Set(
      bookedAppointments.map((a) => a.bookedAt.getTime())
    );

    // Generate slots for the day in the business timezone
    const slots: {
      id: string;
      startAt: string;
      endAt: string;
      isBooked: boolean;
    }[] = [];

    // Create slot times in UTC that correspond to business timezone times
    const slotStartUTC = new Date(Date.UTC(year, month - 1, day, startHour - tzOffset / 60, startMin, 0, 0));
    const dayEndUTC = new Date(Date.UTC(year, month - 1, day, endHour - tzOffset / 60, endMin, 0, 0));

    let current = new Date(slotStartUTC);
    while (current.getTime() + slotDurationMinutes * 60000 <= dayEndUTC.getTime()) {
      const slotEnd = new Date(current.getTime() + slotDurationMinutes * 60000);
      const isBooked = bookedTimes.has(current.getTime());

      // Get the hour in business timezone for the ID
      const localHour = new Date(current.toLocaleString("en-US", { timeZone: BUSINESS_TIMEZONE })).getHours();
      const localMin = new Date(current.toLocaleString("en-US", { timeZone: BUSINESS_TIMEZONE })).getMinutes();

      slots.push({
        id: `${dateParam}-${String(localHour).padStart(2, "0")}${String(localMin).padStart(2, "0")}`,
        startAt: current.toISOString(),
        endAt: slotEnd.toISOString(),
        isBooked,
      });

      current = new Date(slotEnd);
    }

    return NextResponse.json({
      success: true,
      data: {
        settings: {
          startTime,
          endTime,
          slotDurationMinutes,
        },
        slots,
      },
    });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch slots" },
      { status: 500 }
    );
  }
}
