import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
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

    const body = await request.json();
    const { messages, conversationId, pageUrl } = body;
    const sessionId = body.sessionId || `server_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    if (!messages || !Array.isArray(messages)) {
      console.error("Chat validation failed:", {
        hasMessages: !!messages,
        isArray: Array.isArray(messages),
        bodyKeys: Object.keys(body),
      });
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
      // Extract text content from parts array (AI SDK v6 UIMessage format)
      const userContent = Array.isArray(lastUserMessage.parts)
        ? lastUserMessage.parts
            .filter((p: { type: string }) => p.type === "text")
            .map((p: { text: string }) => p.text)
            .join("")
        : typeof lastUserMessage.content === "string"
          ? lastUserMessage.content
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

    // Convert UIMessages (parts format) to ModelMessages (content format) for streamText
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: CHATBOT_SYSTEM_PROMPT,
      messages: modelMessages,
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
