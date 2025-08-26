import openai from "@/lib/openAi/init";
import { NextRequest } from "next/server";
import { withAuthCheck, AuthenticatedRequest } from "@/lib/middlewares/interviewAuth";

async function handleSTT(req: AuthenticatedRequest) {
  const formData = await req.formData();
  const audioFile = formData.get("audio") as File;

  if (!audioFile) {
    return new Response("No audio provided", { status: 400 });
  }

  try {
    // Create transcription
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "gpt-4o-mini-transcribe",
    });

    // Return transcription text as JSON
    return Response.json({ text: response.text });
  } catch (error) {
    console.error("Error during transcription:", error);
    return new Response("Error during transcription", { status: 500 });
  }
}

export async function POST(req: Request) {
  return withAuthCheck(req as NextRequest, handleSTT);
}
