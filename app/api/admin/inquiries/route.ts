import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const isReadParam = searchParams.get("isRead");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      status?: "NEW" | "IN_PROGRESS" | "RESPONDED" | "ARCHIVED";
      isRead?: boolean;
      OR?: Array<
        | { name: { contains: string; mode: "insensitive" } }
        | { email: { contains: string; mode: "insensitive" } }
        | { companyName: { contains: string; mode: "insensitive" } }
      >;
    } = {};

    // Filter by status
    if (status && status !== "all") {
      where.status = status as "NEW" | "IN_PROGRESS" | "RESPONDED" | "ARCHIVED";
    }

    // Filter by read status
    if (isReadParam === "true") {
      where.isRead = true;
    } else if (isReadParam === "false") {
      where.isRead = false;
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build orderBy
    const orderBy: Record<string, "asc" | "desc"> = {
      [sortBy]: sortOrder as "asc" | "desc",
    };

    // Get total count for pagination
    const total = await prisma.contactInquiry.count({ where });

    // Get inquiries
    const inquiries = await prisma.contactInquiry.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch inquiries",
      },
      { status: 500 }
    );
  }
}
