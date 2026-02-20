import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { appointmentReminderEmail } from "@/lib/email-templates";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const now = new Date();
    // Find appointments between 23 and 25 hours from now
    const windowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const appointments = await prisma.appointment.findMany({
      where: {
        status: "CONFIRMED",
        bookingType: { not: "BLOCKED" },
        email: { not: "blocked@internal" },
        bookedAt: {
          gte: windowStart,
          lte: windowEnd,
        },
      },
    });

    let sent = 0;
    for (const appointment of appointments) {
      const email = appointmentReminderEmail(appointment);
      try {
        await sendEmail({
          to: appointment.email,
          subject: email.subject,
          html: email.html,
        });
        sent++;
      } catch (err) {
        console.error(
          `Failed to send reminder to ${appointment.email}:`,
          err
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        found: appointments.length,
        sent,
        timestamp: now.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error sending appointment reminders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process reminders" },
      { status: 500 }
    );
  }
}
