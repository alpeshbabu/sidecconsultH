import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const revalidate = 3600; // Revalidate every hour

// GET /api/services - Get all active services grouped by category
export async function GET() {
  try {
    // Fetch all active services, ordered by sortOrder
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { categorySlug: "asc" },
        { sortOrder: "asc" },
      ],
    });

    // Group services by category
    const servicesByCategory = services.reduce((acc, service) => {
      const categorySlug = service.categorySlug;
      
      if (!acc[categorySlug]) {
        acc[categorySlug] = {
          id: categorySlug,
          name: service.categoryName,
          slug: service.categorySlug,
          icon: service.categoryIcon,
          color: service.categoryColor,
          borderColor: service.categoryBorder,
          services: [],
        };
      }

      acc[categorySlug].services.push({
        id: service.serviceId,
        icon: service.icon,
        title: service.title,
        tagline: service.tagline,
        description: service.description,
        keyOfferings: service.keyOfferings,
        outcomes: service.outcomes,
      });

      return acc;
    }, {} as Record<string, any>);

    // Convert to array
    const serviceCategories = Object.values(servicesByCategory);

    return NextResponse.json({ serviceCategories });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
