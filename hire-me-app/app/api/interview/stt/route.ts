import openai from "@/lib/openAi/init";

export async function POST(req: Request) {
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
