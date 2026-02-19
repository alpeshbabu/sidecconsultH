import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "5");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const services = await prisma.service.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { tagline: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        serviceId: true,
        title: true,
        tagline: true,
        categorySlug: true,
        categoryName: true,
        icon: true,
      },
      orderBy: { sortOrder: "asc" },
      take: limit,
    });

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error("Error searching services:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search services" },
      { status: 500 }
    );
  }
}
