import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const settingsSchema = z.object({
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  slotDurationMinutes: z.number().int().min(15).max(240),
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

    const { startTime, endTime, slotDurationMinutes } = validation.data;

    const settings = await prisma.availabilitySettings.upsert({
      where: { id: "default" },
      update: {
        startTime,
        endTime,
        slotDurationMinutes,
      },
      create: {
        id: "default",
        startTime,
        endTime,
        slotDurationMinutes,
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
