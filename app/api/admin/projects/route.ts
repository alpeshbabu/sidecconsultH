import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { projectSchema } from "@/lib/validations";
import type { Prisma } from "@/lib/generated/prisma";

// GET /api/admin/projects?clientId=&status=&search=&page=&limit=
export async function GET(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId") || undefined;
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search")?.trim() || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));

  const where: Prisma.ProjectWhereInput = {
    ...(clientId && { clientId }),
    ...(status && { status: status as Prisma.ProjectWhereInput["status"] }),
    ...(search && {
      title: { contains: search, mode: "insensitive" },
    }),
  };

  const [total, projects] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, email: true, companyName: true } },
        _count: { select: { milestones: true, documents: true, messages: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
}

// POST /api/admin/projects
export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { clientId, title, description, status, startDate, targetDate } = parsed.data;

  const client = await prisma.user.findFirst({ where: { id: clientId, role: "CLIENT" } });
  if (!client) {
    return NextResponse.json({ success: false, error: "Client not found" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      clientId,
      title: title.trim(),
      description: description?.trim() || null,
      status,
      startDate: startDate ? new Date(startDate) : null,
      targetDate: targetDate ? new Date(targetDate) : null,
    },
    include: {
      client: { select: { id: true, name: true, email: true, companyName: true } },
      _count: { select: { milestones: true, documents: true, messages: true } },
    },
  });

  return NextResponse.json({ success: true, data: project }, { status: 201 });
}
