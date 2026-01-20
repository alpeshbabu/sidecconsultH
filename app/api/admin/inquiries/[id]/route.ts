import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema for updating inquiry
const updateInquirySchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESPONDED", "ARCHIVED"]).optional(),
  isRead: z.boolean().optional(),
  internalNotes: z.string().optional(),
  supplierAddress: z.string().max(1000).optional(),
  estimatedBudget: z.string().max(200).optional(),
  otherSites: z.string().max(2000).optional(),
  otherSiteLocations: z.string().max(2000).optional(),
  expectedDocuments: z.string().max(3000).optional(),
  regulatoryStandards: z.string().max(3000).optional(),
});

// GET /api/admin/inquiries/[id] - Get single inquiry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const inquiry = await prisma.contactInquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return NextResponse.json(
        {
          success: false,
          error: "Inquiry not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch inquiry",
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/inquiries/[id] - Update inquiry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    const validationResult = updateInquirySchema.safeParse(body);
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

    // Check if inquiry exists
    const existingInquiry = await prisma.contactInquiry.findUnique({
      where: { id },
    });

    if (!existingInquiry) {
      return NextResponse.json(
        {
          success: false,
          error: "Inquiry not found",
        },
        { status: 404 }
      );
    }

    // Update inquiry
    const updatedInquiry = await prisma.contactInquiry.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedInquiry,
    });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update inquiry",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/inquiries/[id] - Delete inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if inquiry exists
    const existingInquiry = await prisma.contactInquiry.findUnique({
      where: { id },
    });

    if (!existingInquiry) {
      return NextResponse.json(
        {
          success: false,
          error: "Inquiry not found",
        },
        { status: 404 }
      );
    }

    // Delete inquiry
    await prisma.contactInquiry.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete inquiry",
      },
      { status: 500 }
    );
  }
}
