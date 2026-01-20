import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get all categories with post counts
    const categories = await prisma.category.findMany({
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: "PUBLISHED",
              },
            },
          },
        },
      },
    });

    // Transform to include count directly
    const categoriesWithCount = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      sortOrder: category.sortOrder,
      postCount: category._count.posts,
    }));

    // Get total published posts count
    const totalPosts = await prisma.blogPost.count({
      where: { status: "PUBLISHED" },
    });

    return NextResponse.json({
      success: true,
      data: categoriesWithCount,
      totalPosts,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}
