import openai from "@/lib/openAi/init";
import { NextResponse, NextRequest } from "next/server";
import { withAuthCheck, AuthenticatedRequest } from "@/lib/middlewares/interviewAuth";

async function handleTTS(req: AuthenticatedRequest) {
  try {
    const { text } = await req.json();
    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
      });
    }
    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
    });
  //  console.log("TTS response:", response);
    const buffer = await response.arrayBuffer();
    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return withAuthCheck(req as NextRequest, handleTTS);
}
