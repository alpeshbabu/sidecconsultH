import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Default business timezone - can be overridden in settings
const DEFAULT_TIMEZONE = "America/New_York";

/**
 * Get the UTC offset in hours for a timezone on a specific date
 * Returns positive for timezones behind UTC (e.g., +8 for Pacific = UTC-8)
 */
function getTimezoneOffsetHours(timezone: string, year: number, month: number, day: number): number {
  // Create a date at noon to avoid DST edge cases
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  
  // Format in both UTC and target timezone
  const utcFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    hour: "numeric",
    hour12: false,
  });
  
  const tzFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  });
  
  const utcHour = parseInt(utcFormatter.format(date), 10);
  const tzHour = parseInt(tzFormatter.format(date), 10);
  
  // Calculate offset: how many hours to ADD to local time to get UTC
  // e.g., Pacific (UTC-8): when UTC is 12, Pacific is 4, so offset = 12 - 4 = 8
  // To convert 8 AM Pacific to UTC: 8 + 8 = 16:00 UTC
  let offset = utcHour - tzHour;
  
  // Handle day boundary (e.g., if tzHour is 20 and utcHour is 4 next day)
  if (offset < -12) offset += 24;
  if (offset > 12) offset -= 24;
  
  return offset;
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
        timezone: DEFAULT_TIMEZONE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const { startTime, endTime, slotDurationMinutes, timezone } = settings;
    const BUSINESS_TIMEZONE = timezone || DEFAULT_TIMEZONE;
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
            timezone: BUSINESS_TIMEZONE,
          },
          slots: [],
        },
      });
    }

    // Parse the date
    const [year, month, day] = dateParam.split("-").map(Number);
    
    // Get timezone offset in hours (positive means behind UTC, e.g., Pacific = +8)
    const offsetHours = getTimezoneOffsetHours(BUSINESS_TIMEZONE, year, month, day);
    
    // Convert business timezone times to UTC
    // 8 AM Pacific + 8 hours offset = 16:00 UTC
    const startUTCHour = startHour + offsetHours;
    const endUTCHour = endHour + offsetHours;
    
    // Create start and end of the slot range in UTC
    const slotStartUTC = new Date(Date.UTC(year, month - 1, day, startUTCHour, startMin, 0, 0));
    const slotEndUTC = new Date(Date.UTC(year, month - 1, day, endUTCHour, endMin, 0, 0));
    
    // Adjust for slots that span into next day in UTC
    // (e.g., 5 PM Pacific on Jan 20 = 1 AM UTC on Jan 21)
    
    // Create date range for fetching booked appointments
    const dateStart = new Date(slotStartUTC.getTime() - 24 * 60 * 60 * 1000); // 1 day before
    const dateEnd = new Date(slotEndUTC.getTime() + 24 * 60 * 60 * 1000); // 1 day after

    // Fetch booked appointments for this date range
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

    // Generate slots for the day
    const slots: {
      id: string;
      startAt: string;
      endAt: string;
      isBooked: boolean;
      localTime: string; // For debugging/display
    }[] = [];

    let current = new Date(slotStartUTC);
    while (current.getTime() + slotDurationMinutes * 60000 <= slotEndUTC.getTime()) {
      const slotEnd = new Date(current.getTime() + slotDurationMinutes * 60000);
      const isBooked = bookedTimes.has(current.getTime());

      // Format the time in business timezone for display
      const localTimeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: BUSINESS_TIMEZONE,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      
      const localTime = localTimeFormatter.format(current);
      
      // Get hour and minute in business timezone for the slot ID
      const hourFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: BUSINESS_TIMEZONE,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const [localHourStr, localMinStr] = hourFormatter.format(current).split(":");

      slots.push({
        id: `${dateParam}-${localHourStr}${localMinStr}`,
        startAt: current.toISOString(),
        endAt: slotEnd.toISOString(),
        isBooked,
        localTime,
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
          timezone: BUSINESS_TIMEZONE,
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
