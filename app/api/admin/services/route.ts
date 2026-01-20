import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// GET /api/admin/services - List all services
// Note: Authentication is handled by middleware
export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const categorySlug = searchParams.get("category") || "";
    const status = searchParams.get("status") || "all";
    const sortBy = searchParams.get("sortBy") || "sortOrder";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tagline: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categorySlug) {
      where.categorySlug = categorySlug;
    }

    if (status !== "all") {
      where.isActive = status === "active";
    }

    // Build orderBy
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Fetch services with pagination
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.service.count({ where }),
    ]);

    return NextResponse.json({
      services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST /api/admin/services - Create new service
// Note: Authentication is handled by middleware
export async function POST(request: NextRequest) {
  try {

    const body = await request.json();

    // Validate required fields
    if (!body.categoryName || !body.categorySlug || !body.serviceId || !body.title || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if serviceId already exists
    const existing = await prisma.service.findUnique({
      where: { serviceId: body.serviceId },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Service ID already exists" },
        { status: 400 }
      );
    }

    // Create service
    const service = await prisma.service.create({
      data: {
        categoryName: body.categoryName,
        categorySlug: body.categorySlug,
        categoryIcon: body.categoryIcon || null,
        categoryColor: body.categoryColor || null,
        categoryBorder: body.categoryBorder || null,
        serviceId: body.serviceId,
        icon: body.icon || null,
        title: body.title,
        tagline: body.tagline || null,
        description: body.description,
        keyOfferings: body.keyOfferings || [],
        outcomes: body.outcomes || [],
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
