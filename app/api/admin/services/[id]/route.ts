import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// GET /api/admin/services/[id] - Get single service
// Note: Authentication is handled by middleware
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/services/[id] - Update service
// Note: Authentication is handled by middleware
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if service exists
    const existing = await prisma.service.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // If serviceId is being changed, check for conflicts
    if (body.serviceId && body.serviceId !== existing.serviceId) {
      const conflict = await prisma.service.findUnique({
        where: { serviceId: body.serviceId },
      });

      if (conflict) {
        return NextResponse.json(
          { error: "Service ID already exists" },
          { status: 400 }
        );
      }
    }

    // Update service
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(body.categoryName && { categoryName: body.categoryName }),
        ...(body.categorySlug && { categorySlug: body.categorySlug }),
        ...(body.categoryIcon !== undefined && { categoryIcon: body.categoryIcon }),
        ...(body.categoryColor !== undefined && { categoryColor: body.categoryColor }),
        ...(body.categoryBorder !== undefined && { categoryBorder: body.categoryBorder }),
        ...(body.serviceId && { serviceId: body.serviceId }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.title && { title: body.title }),
        ...(body.tagline !== undefined && { tagline: body.tagline }),
        ...(body.description && { description: body.description }),
        ...(body.keyOfferings && { keyOfferings: body.keyOfferings }),
        ...(body.outcomes && { outcomes: body.outcomes }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/services/[id] - Delete service
// Note: Authentication is handled by middleware
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if service exists
    const existing = await prisma.service.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Delete service
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
