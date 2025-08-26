import { auth } from "@/lib/auth";
import { getCandidateCredits, getCandidateByUserId } from "@/lib/interviewCredits";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const candidate = await getCandidateByUserId(session.user.id);
    
    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate profile not found" },
        { status: 404 }
      );
    }

    const creditsRemaining = await getCandidateCredits(candidate.id);

    return NextResponse.json({
      creditsRemaining,
      totalCredits: 3,
      candidateId: candidate.id,
      candidateName: `${candidate.firstName} ${candidate.lastName}`.trim()
    });
  } catch (error) {
    console.error("Error fetching interview credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview credits" },
      { status: 500 }
    );
  }
}
