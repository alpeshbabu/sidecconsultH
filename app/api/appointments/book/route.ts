import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import {
  bookingConfirmationEmail,
  adminNotificationEmail,
} from "@/lib/email-templates";

const bookingSchema = z.object({
  date: z.string().min(10), // YYYY-MM-DD
  time: z.string().min(5), // HH:mm
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  companyName: z.string().max(200).optional(),
  serviceInterest: z.string().optional(),
  notes: z.string().max(2000).optional(),
  timeZone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = bookingSchema.safeParse(body);

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

    const {
      date,
      time,
      name,
      email,
      phone,
      companyName,
      serviceInterest,
      notes,
      timeZone,
    } = validation.data;

    // Fetch availability settings
    const settings = await prisma.availabilitySettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      return NextResponse.json(
        { success: false, error: "Availability settings not configured" },
        { status: 500 }
      );
    }

    // Parse the booking time
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const bookedAt = new Date(year, month - 1, day, hour, minute, 0, 0);
    const bookedEndAt = new Date(
      bookedAt.getTime() + settings.slotDurationMinutes * 60000
    );

    // Validate the time is within availability hours
    const [startHour, startMin] = settings.startTime.split(":").map(Number);
    const [endHour, endMin] = settings.endTime.split(":").map(Number);
    const dayStart = new Date(year, month - 1, day, startHour, startMin, 0, 0);
    const dayEnd = new Date(year, month - 1, day, endHour, endMin, 0, 0);

    if (bookedAt < dayStart || bookedEndAt > dayEnd) {
      return NextResponse.json(
        { success: false, error: "Selected time is outside availability hours" },
        { status: 400 }
      );
    }

    // Check if slot is already booked
    const existing = await prisma.appointment.findFirst({
      where: {
        bookedAt,
        status: {
          not: "CANCELLED",
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "This time slot is already booked" },
        { status: 409 }
      );
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        bookedAt,
        bookedEndAt,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        companyName: companyName?.trim() || null,
        serviceInterest: serviceInterest || null,
        notes: notes?.trim() || null,
        timeZone: timeZone || null,
        status: "REQUESTED",
      },
    });

    // Send confirmation email to client (fire-and-forget)
    const confirmationEmail = bookingConfirmationEmail(appointment);
    sendEmail({
      to: appointment.email,
      subject: confirmationEmail.subject,
      html: confirmationEmail.html,
    }).catch((err) => console.error("Failed to send booking confirmation:", err));

    // Notify admin of new request (fire-and-forget)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (adminEmail) {
      const adminNotif = adminNotificationEmail(appointment);
      sendEmail({
        to: adminEmail,
        subject: adminNotif.subject,
        html: adminNotif.html,
      }).catch((err) => console.error("Failed to send admin notification:", err));
    }

    return NextResponse.json(
      {
        success: true,
        message: "Appointment request submitted successfully",
        data: {
          id: appointment.id,
          bookedAt: appointment.bookedAt,
          bookedEndAt: appointment.bookedEndAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to book appointment" },
      { status: 500 }
    );
  }
}
