import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { clientSchema } from "@/lib/validations";
import { createMagicLink } from "@/lib/magic-link";
import { sendEmail } from "@/lib/email";
import { portalInviteEmail } from "@/lib/email-templates";

// GET /api/admin/clients?search=&page=&limit=
export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

  const where = {
    role: "CLIENT" as const,
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { companyName: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [total, clients] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        companyName: true,
        createdAt: true,
        lastLoginAt: true,
        _count: { select: { projects: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: clients,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
}

// POST /api/admin/clients  — create a CLIENT user, optionally send a portal invite
export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = clientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request data",
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { name, email, companyName, sendInvite } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json(
      { success: false, error: "A user with this email already exists" },
      { status: 409 }
    );
  }

  const client = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      companyName: companyName?.trim() || null,
      role: "CLIENT",
    },
    select: {
      id: true,
      name: true,
      email: true,
      companyName: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  if (sendInvite) {
    const token = await createMagicLink(client.id);
    const base = process.env.NEXTAUTH_URL || new URL(request.url).origin;
    const link = `${base}/portal/auth/verify?token=${token}&email=${encodeURIComponent(
      client.email
    )}`;
    const tpl = portalInviteEmail({ name: client.name, link });
    sendEmail({ to: client.email, subject: tpl.subject, html: tpl.html }).catch(
      (err) => console.error("Failed to send portal invite:", err)
    );
  }

  return NextResponse.json({ success: true, data: client }, { status: 201 });
}
