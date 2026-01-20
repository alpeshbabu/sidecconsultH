import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
    const dateStart = new Date(year, month - 1, day, 0, 0, 0, 0);
    const dateEnd = new Date(year, month - 1, day, 23, 59, 59, 999);

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

    // Generate slots for the day
    const slots: {
      id: string;
      startAt: string;
      endAt: string;
      isBooked: boolean;
    }[] = [];

    const slotStart = new Date(year, month - 1, day, startHour, startMin, 0, 0);
    const dayEnd = new Date(year, month - 1, day, endHour, endMin, 0, 0);

    let current = new Date(slotStart);
    while (current.getTime() + slotDurationMinutes * 60000 <= dayEnd.getTime()) {
      const slotEnd = new Date(current.getTime() + slotDurationMinutes * 60000);
      const isBooked = bookedTimes.has(current.getTime());

      slots.push({
        id: `${dateParam}-${current.getHours().toString().padStart(2, "0")}${current.getMinutes().toString().padStart(2, "0")}`,
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
