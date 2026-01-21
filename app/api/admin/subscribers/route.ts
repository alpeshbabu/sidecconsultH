import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/admin/subscribers - List all subscribers
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const where: { isActive?: boolean } = {};
    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    const [subscribers, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy: { subscribedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.subscriber.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/subscribers - Delete/unsubscribe a subscriber
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action") || "delete"; // "delete" or "unsubscribe"

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    if (action === "unsubscribe") {
      await prisma.subscriber.update({
        where: { id },
        data: {
          isActive: false,
          unsubscribedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true, message: "Subscriber unsubscribed" });
    }

    await prisma.subscriber.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Subscriber deleted" });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/subscribers - Reactivate a subscriber
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    await prisma.subscriber.update({
      where: { id },
      data: {
        isActive: true,
        unsubscribedAt: null,
      },
    });

    return NextResponse.json({ success: true, message: "Subscriber reactivated" });
  } catch (error) {
    console.error("Error reactivating subscriber:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reactivate subscriber" },
      { status: 500 }
    );
  }
}
