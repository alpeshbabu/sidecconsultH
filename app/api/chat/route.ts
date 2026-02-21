import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { CHATBOT_SYSTEM_PROMPT } from "@/lib/chatbot-context";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit({
      key: `chat:${ip}`,
      limit: 30,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimit.success) {
      return new Response(
        JSON.stringify({ error: "Too many messages. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages, conversationId, sessionId, pageUrl } = await request.json();

    if (!messages || !Array.isArray(messages) || !sessionId) {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.chatConversation.findUnique({
        where: { id: conversationId },
      });
    }

    if (!conversation) {
      conversation = await prisma.chatConversation.create({
        data: {
          sessionId,
          pageUrl: pageUrl || null,
          ipAddress: ip,
        },
      });
    }

    // Save the latest user message
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage?.role === "user") {
      // Extract text content from parts array or content string
      const userContent =
        typeof lastUserMessage.content === "string"
          ? lastUserMessage.content
          : Array.isArray(lastUserMessage.parts)
            ? lastUserMessage.parts
                .filter((p: { type: string }) => p.type === "text")
                .map((p: { text: string }) => p.text)
                .join("")
            : "";

      if (userContent) {
        await prisma.chatMessage.create({
          data: {
            conversationId: conversation.id,
            role: "user",
            content: userContent,
          },
        });
      }
    }

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: CHATBOT_SYSTEM_PROMPT,
      messages,
      maxOutputTokens: 500,
      temperature: 0.7,
      onFinish: async ({ text }) => {
        try {
          await prisma.chatMessage.create({
            data: {
              conversationId: conversation!.id,
              role: "assistant",
              content: text,
            },
          });
          await prisma.chatConversation.update({
            where: { id: conversation!.id },
            data: {
              messageCount: { increment: 2 },
              updatedAt: new Date(),
            },
          });
        } catch (err) {
          console.error("Failed to save chat message:", err);
        }
      },
    });

    return result.toUIMessageStreamResponse({
      headers: {
        "X-Conversation-Id": conversation.id,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your message." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
