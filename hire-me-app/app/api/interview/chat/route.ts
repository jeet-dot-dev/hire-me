import { buildSystemPrompt } from "@/components/interview/prompts/recruiter";
import openai from "@/lib/openAi/init";
import { NextResponse, NextRequest } from "next/server";
import { withAuthCheck, AuthenticatedRequest } from "@/lib/middlewares/interviewAuth";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

async function handleInterviewChat(request: AuthenticatedRequest) {
  try {
    const { messages, instruction, jobinfo, resume } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const jobSummary = jobinfo ? jobinfo.substring(0, 200) + "..." : "";
    const systemPrompt = buildSystemPrompt(instruction, jobSummary, resume);

    // Keep only last 3 messages to save tokens
    const recentMessages = messages.slice(-3);
    
    const gptMessages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...recentMessages.map(
        (m: { role: string; text: string }): ChatCompletionMessageParam => ({
          role: m.role === "candidate" ? "user" : "assistant",
          content: m.text,
        })
      ),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: gptMessages,
      temperature: 0.9, // High temperature for maximum unpredictability
      max_tokens: 60, // Very concise responses
    });
    
    const reply = completion.choices[0].message?.content || "Can you tell me more?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return withAuthCheck(request as NextRequest, handleInterviewChat);
}