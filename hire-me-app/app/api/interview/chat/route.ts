
import { buildSystemPrompt } from "@/components/interview/prompts/recruiter";
import openai from "@/lib/openAi/init";
import { NextResponse } from "next/server";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export async function POST(request: Request) {
  try {
    const { messages, instruction, jobinfo } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        { status: 400 }
      );
    }

    // Extract key requirements from job description (first 200 chars to save tokens)
    const jobSummary = jobinfo ? jobinfo.substring(0, 200) + "..." : "";
    
    // Build dynamic system prompt based on instruction and job requirements
    const systemPrompt = buildSystemPrompt(instruction, jobSummary);
    
    // Keep only last 4 messages to limit token usage
    const recentMessages = messages.slice(-4);
    
    const gptMessages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...recentMessages.map(
        (m: { role: string; text: string }): ChatCompletionMessageParam => ({
          role: m.role === "candidate" ? "user" : "assistant",
          content: m.text,
        })
      ),
    ];

    console.log("GPT Messages:", gptMessages);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // More cost-effective than gpt-4o-mini
      messages: gptMessages,
      temperature: 0.7,
      max_tokens: 150, // Limit response length
    });
    
    console.log("GPT Completion:", completion);
    
    const reply = completion.choices[0].message?.content || "Can you repeat that?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}

