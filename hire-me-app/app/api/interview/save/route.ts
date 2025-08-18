import { getAiRecommendations } from "@/components/interview/functions/getAiRecomendations";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      applicationId,
      jobId,
      conversation,
      suspiciousActivities,
      description,
    } = await req.json();
    if (!applicationId || !jobId || !conversation) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
    });
    if (!application) {
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404,
      });
    }

    const {
      transcriptSummary,
      interviewScore,
      aiRecommendation,
      strongPoints,
      weakPoints,
      aiSuggestions,
    } = await getAiRecommendations(
      conversation,
      suspiciousActivities,
      description
    );

    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        transcript: conversation,
        transcriptSummary,
        interviewScore,
        aiRecommendation,
        strongPoints,
        weakPoints,
        aiSuggestions,
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.log("Error saving interview:", error);
    return new Response(JSON.stringify({ error: "Failed to save interview" }), {
      status: 500,
    });
  }
}
