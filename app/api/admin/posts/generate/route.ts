import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session?.user || session.user.role === "CLIENT") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, excerpt, categoryName, keywords, customPrompt } = await request.json();

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    // 2. Build the system & user prompts
    const systemPrompt = `You are a professional medical device engineering and quality systems consultant. 
You write detailed, highly technical, and scientifically rigorous blog articles. 
Your writing style is professional, direct, and authoritative (similar to a principal engineer).
Avoid generic fluff, vague summaries, or hype words. Write concrete, actionable advice with industry references (e.g., ISO 13485, FDA QMSR, ISO 14971, validation stages like IQ/OQ/PQ) when relevant.
Always format your response using clean, professional Markdown. Use headings, bullet points, lists, and bold text to make it readable. Do not wrap the response in a markdown code block (e.g. \`\`\`markdown) — return the raw markdown content directly.`;

    let userPrompt = `Generate a comprehensive, high-quality technical blog post content.
Title: "${title}"
${excerpt ? `Excerpt/Abstract: "${excerpt}"` : ""}
${categoryName ? `Category: "${categoryName}"` : ""}
${keywords ? `Focus Keywords: "${keywords}"` : ""}

Guidelines:
1. Write a compelling introduction explaining the engineering or regulatory challenge.
2. Provide deep technical explanations with step-by-step instructions or industry standards.
3. Write about the practical implications for injection molding (thermoplastics/LSR) or medical device quality systems.
4. Conclude with actionable take-aways for manufacturing engineers and QA managers.
5. The length should be substantial (approx. 800 - 1500 words).
`;

    if (customPrompt) {
      userPrompt += `\nAdditional user guidelines/outline to follow: ${customPrompt}`;
    }

    // 3. Call OpenAI model using Vercel AI SDK
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxOutputTokens: 2500,
    });

    return NextResponse.json({
      success: true,
      content: text,
    });
  } catch (error: any) {
    console.error("Error generating post content:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate content" },
      { status: 500 }
    );
  }
}
