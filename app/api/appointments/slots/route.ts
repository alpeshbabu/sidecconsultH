import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  DEFAULT_TIMEZONE,
  formatZonedTime,
  timeZoneAbbreviation,
  timeZoneLabel,
  zonedHourMinute,
  zonedWallTimeToUtc,
} from "@/lib/timezone";

// GET /api/appointments/slots?date=YYYY-MM-DD
// Returns dynamically generated slots for a specific date, in the business timezone.
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

    const settingsResponse = {
      startTime,
      endTime,
      slotDurationMinutes,
      timezone: BUSINESS_TIMEZONE,
      timezoneLabel: timeZoneLabel(BUSINESS_TIMEZONE),
    };

    // If no date provided, return settings only
    if (!dateParam) {
      return NextResponse.json({
        success: true,
        data: { settings: settingsResponse, slots: [] },
      });
    }

    // Parse the date and resolve the business-hours window to canonical UTC.
    const [year, month, day] = dateParam.split("-").map(Number);
    const slotStartUTC = zonedWallTimeToUtc(
      year,
      month,
      day,
      startHour,
      startMin,
      BUSINESS_TIMEZONE
    );
    const slotEndUTC = zonedWallTimeToUtc(
      year,
      month,
      day,
      endHour,
      endMin,
      BUSINESS_TIMEZONE
    );

    // Fetch booked appointments overlapping a generous window around the day.
    const dateStart = new Date(slotStartUTC.getTime() - 24 * 60 * 60 * 1000);
    const dateEnd = new Date(slotEndUTC.getTime() + 24 * 60 * 60 * 1000);

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        bookedAt: { gte: dateStart, lte: dateEnd },
        status: { not: "CANCELLED" },
      },
      select: { bookedAt: true },
    });

    const bookedTimes = new Set(
      bookedAppointments.map((a) => a.bookedAt.getTime())
    );

    // Hide slots that have already elapsed (relevant for "today").
    const now = Date.now();

    const slots: {
      id: string;
      startAt: string;
      endAt: string;
      isBooked: boolean;
      localTime: string;
    }[] = [];

    const slotMs = slotDurationMinutes * 60000;
    let current = new Date(slotStartUTC);
    while (current.getTime() + slotMs <= slotEndUTC.getTime()) {
      const slotEnd = new Date(current.getTime() + slotMs);

      if (current.getTime() > now) {
        const [localHourStr, localMinStr] = zonedHourMinute(
          current,
          BUSINESS_TIMEZONE
        );
        slots.push({
          id: `${dateParam}-${localHourStr}${localMinStr}`,
          startAt: current.toISOString(),
          endAt: slotEnd.toISOString(),
          isBooked: bookedTimes.has(current.getTime()),
          localTime: formatZonedTime(current, BUSINESS_TIMEZONE),
        });
      }

      current = slotEnd;
    }

    return NextResponse.json({
      success: true,
      data: {
        settings: {
          ...settingsResponse,
          // Abbreviation (PST/PDT) is date-specific because of DST.
          timezoneAbbreviation: timeZoneAbbreviation(
            slotStartUTC,
            BUSINESS_TIMEZONE
          ),
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
