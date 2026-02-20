import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { newsletterWelcomeEmail } from "@/lib/email-templates";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// POST /api/subscribe - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { success: false, error: "You're already subscribed!" },
          { status: 409 }
        );
      }
      
      // Reactivate subscription
      await prisma.subscriber.update({
        where: { email: normalizedEmail },
        data: {
          isActive: true,
          unsubscribedAt: null,
          subscribedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Welcome back! Your subscription has been reactivated.",
      });
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: {
        email: normalizedEmail,
      },
    });

    // Send welcome email to new subscriber (fire-and-forget)
    const welcome = newsletterWelcomeEmail(normalizedEmail);
    sendEmail({
      to: normalizedEmail,
      subject: welcome.subject,
      html: welcome.html,
    }).catch((err) => console.error("Failed to send newsletter welcome:", err));

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing!",
    });
  } catch (error) {
    console.error("Error subscribing:", error);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
