import { getAiRecommendations } from "@/components/interview/functions/getAiRecomendations";
import { prisma } from "@/lib/prisma";
import { withAuthCheck, AuthenticatedRequest } from "@/lib/middlewares/interviewAuth";
import { NextResponse, NextRequest } from "next/server";

async function handleInterviewSave(req: AuthenticatedRequest) {
  try {
    const {
      applicationId,
      jobId,
      conversation,
      suspiciousActivities,
      description,
    } = await req.json();

    if (!applicationId || !jobId || !conversation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      select: { candidateId: true }
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Verify the application belongs to the authenticated candidate
    if (application.candidateId !== req.candidate!.id) {
      return NextResponse.json(
        { error: "Unauthorized access to application" },
        { status: 403 }
      );
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error saving interview:", error);
    return NextResponse.json(
      { error: "Failed to save interview" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return withAuthCheck(req as NextRequest, handleInterviewSave);
}
