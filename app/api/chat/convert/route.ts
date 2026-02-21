import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { conversationId, convertedTo } = await request.json();

    if (!conversationId || !["contact", "schedule"].includes(convertedTo)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await prisma.chatConversation.update({
      where: { id: conversationId },
      data: {
        convertedTo,
        status: "CONVERTED",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chat convert error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
