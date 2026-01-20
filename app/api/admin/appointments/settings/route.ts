import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

// Valid IANA timezones for US
const VALID_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "UTC",
];

const settingsSchema = z.object({
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format").optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format").optional(),
  slotDurationMinutes: z.number().int().min(15).max(240).optional(),
  timezone: z.string().refine((val) => VALID_TIMEZONES.includes(val), {
    message: "Invalid timezone",
  }).optional(),
});

// GET /api/admin/appointments/settings
export async function GET() {
  try {
    let settings = await prisma.availabilitySettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.availabilitySettings.create({
        data: {
          id: "default",
          startTime: "08:00",
          endTime: "17:00",
          slotDurationMinutes: 30,
          timezone: "America/New_York",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching availability settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/appointments/settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = settingsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { startTime, endTime, slotDurationMinutes, timezone } = validation.data;

    // Build update data - only include fields that were provided
    const updateData: {
      startTime?: string;
      endTime?: string;
      slotDurationMinutes?: number;
      timezone?: string;
    } = {};
    
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (slotDurationMinutes !== undefined) updateData.slotDurationMinutes = slotDurationMinutes;
    if (timezone !== undefined) updateData.timezone = timezone;

    const settings = await prisma.availabilitySettings.upsert({
      where: { id: "default" },
      update: updateData,
      create: {
        id: "default",
        startTime: startTime || "08:00",
        endTime: endTime || "17:00",
        slotDurationMinutes: slotDurationMinutes || 30,
        timezone: timezone || "America/New_York",
      },
    });

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error updating availability settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
