import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createMagicLink } from "@/lib/magic-link";
import { sendEmail } from "@/lib/email";
import { magicLinkEmail } from "@/lib/email-templates";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({ email: z.string().email() });

// POST /api/portal/auth/request-link  { email }
// Sends a one-time sign-in link to a CLIENT user. Always responds generically
// so the endpoint can't be used to enumerate accounts.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = await checkRateLimit({
    key: `portal-magic:${ip}`,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!rate.success) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  if (user && user.role === "CLIENT") {
    const token = await createMagicLink(user.id);
    const base = process.env.NEXTAUTH_URL || new URL(request.url).origin;
    const link = `${base}/portal/auth/verify?token=${token}&email=${encodeURIComponent(
      email
    )}`;
    const tpl = magicLinkEmail({ name: user.name, link });
    sendEmail({ to: email, subject: tpl.subject, html: tpl.html }).catch((err) =>
      console.error("Failed to send magic-link email:", err)
    );
  }

  return NextResponse.json({
    success: true,
    message: "If an account exists for that email, a sign-in link is on its way.",
  });
}
