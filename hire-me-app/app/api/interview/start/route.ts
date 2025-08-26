// /app/api/interview/start/route.ts
import { prisma } from "@/lib/prisma";
import { withInterviewCreditsCheck, AuthenticatedRequest } from "@/lib/middlewares/interviewAuth";
import { consumeInterviewCredit } from "@/lib/interviewCredits";
import { NextResponse, NextRequest } from "next/server";

async function handleInterviewStart(req: AuthenticatedRequest) {
  try {
    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: "Missing applicationId" },
        { status: 400 }
      );
    }

    // Verify the application belongs to the authenticated candidate
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      select: { candidateId: true, isInterviewDone: true }
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.candidateId !== req.candidate!.id) {
      return NextResponse.json(
        { error: "Unauthorized access to application" },
        { status: 403 }
      );
    }

    if (application.isInterviewDone) {
      return NextResponse.json(
        { error: "Interview already completed for this application" },
        { status: 400 }
      );
    }

    // Consume an interview credit
    const creditResult = await consumeInterviewCredit(req.candidate!.id);
    if (!creditResult.success) {
      return NextResponse.json(
        { 
          error: creditResult.message || "Unable to start interview",
          creditsRemaining: creditResult.creditsRemaining
        },
        { status: 402 }
      );
    }

    // Update application record
    const updatedApp = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { isInterviewDone: true },
    });

    return NextResponse.json({
      success: true,
      application: updatedApp,
      creditsRemaining: creditResult.creditsRemaining,
      message: `Interview started successfully. You have ${creditResult.creditsRemaining} credits remaining.`
    });
  } catch (error) {
    console.error("Error starting interview:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return withInterviewCreditsCheck(req as NextRequest, handleInterviewStart);
}
