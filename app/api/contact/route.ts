import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactInquirySchema } from "@/lib/validations";
import { sendEmail } from "@/lib/email";
import {
  contactInquiryConfirmationEmail,
  contactInquiryAdminNotificationEmail,
} from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the data using Zod schema
    const validationResult = contactInquirySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Create the contact inquiry in the database
    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone?.trim() || null,
        companyName: data.companyName?.trim() || null,
        serviceInterest: data.serviceInterest,
        projectTimeline: data.projectTimeline,
        message: data.message.trim(),
        status: "NEW",
        isRead: false,
      },
    });

    console.log(`New contact inquiry created: ${inquiry.id}`);

    // Send confirmation email to client (fire-and-forget)
    const confirmEmail = contactInquiryConfirmationEmail(inquiry);
    sendEmail({
      to: inquiry.email,
      subject: confirmEmail.subject,
      html: confirmEmail.html,
    }).catch((err) => console.error("Failed to send contact confirmation:", err));

    // Notify admin of new inquiry (fire-and-forget)
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (adminEmail) {
      const adminNotif = contactInquiryAdminNotificationEmail(inquiry);
      sendEmail({
        to: adminEmail,
        subject: adminNotif.subject,
        html: adminNotif.html,
      }).catch((err) => console.error("Failed to send admin inquiry notification:", err));
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your inquiry. We will be in touch within 24-48 hours.",
        data: {
          id: inquiry.id,
          createdAt: inquiry.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating contact inquiry:", error);

    // Check for specific database errors
    if (error instanceof Error) {
      // Prisma connection error
      if (error.message.includes("connect")) {
        return NextResponse.json(
          {
            success: false,
            error: "Unable to process your request. Please try again later.",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Optional: GET handler to check API health
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Contact API is running",
  });
}
