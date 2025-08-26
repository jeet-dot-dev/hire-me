import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkInterviewCredits } from "@/lib/interviewCredits";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jobId, resumeUrl } = body;
    
    if (!jobId || !resumeUrl) {
      return NextResponse.json(
        { error: "Job ID and Resume URL are required" },
        { status: 400 }
      );
    }

    const candidate = await prisma.candidate.findUnique({
      where: { userId: session.user.id },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate profile not found" },
        { status: 404 }
      );
    }

    // Check if candidate has interview credits before allowing application
    const creditsCheck = await checkInterviewCredits(candidate.id);
    if (!creditsCheck.success) {
      return NextResponse.json(
        { 
          error: creditsCheck.message || "Free tier limit reached. Please upgrade to continue.",
          creditsRemaining: creditsCheck.creditsRemaining,
          upgradeRequired: true
        },
        { status: 402 } // Payment Required
      );
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        resumeUrl,
        candidateId: candidate.id,
        status: "Pending",
      },
    });

    return NextResponse.json({
      ...application,
      creditsRemaining: creditsCheck.creditsRemaining
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
