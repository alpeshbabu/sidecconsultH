import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
});

// GET /api/admin/tags - Get all tags
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tags",
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/tags - Create new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = tagSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if slug is unique
    const existingSlug = await prisma.tag.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      return NextResponse.json(
        {
          success: false,
          error: "A tag with this slug already exists",
        },
        { status: 400 }
      );
    }

    // Check if name is unique
    const existingName = await prisma.tag.findUnique({
      where: { name: data.name },
    });

    if (existingName) {
      return NextResponse.json(
        {
          success: false,
          error: "A tag with this name already exists",
        },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });

    return NextResponse.json({
      success: true,
      data: tag,
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create tag",
      },
      { status: 500 }
    );
  }
}
