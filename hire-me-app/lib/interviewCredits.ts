import { prisma } from "@/lib/prisma";

export interface InterviewCreditsResult {
  success: boolean;
  creditsRemaining: number;
  message?: string;
}

/**
 * Check if a candidate has remaining interview credits
 */
export async function checkInterviewCredits(credits: number): Promise<InterviewCreditsResult> {
  try {
    if (credits <= 0) {
      return {
        success: false,
        creditsRemaining: 0,
        message: "Free tier limit reached. Please upgrade to continue."
      };
    }

    return {
      success: true,
      creditsRemaining: credits
    };
  } catch (error) {
    console.error("Error checking interview credits:", error);
    return {
      success: false,
      creditsRemaining: 0,
      message: "Error checking interview credits"
    };
  }
}

/**
 * Consume one interview credit from a candidate
 */
export async function consumeInterviewCredit(candidateId: string): Promise<InterviewCreditsResult> {
  try {
    // Get candidate to check credits before consuming
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      select: { interviewCredits: true }
    });

    if (!candidate) {
      return {
        success: false,
        creditsRemaining: 0,
        message: "Candidate not found"
      };
    }

    if (candidate.interviewCredits <= 0) {
      return {
        success: false,
        creditsRemaining: 0,
        message: "Free tier limit reached. Please upgrade to continue."
      };
    }

    // Consume one credit
    const updatedCandidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        interviewCredits: {
          decrement: 1
        }
      },
      select: { interviewCredits: true }
    });

    return {
      success: true,
      creditsRemaining: updatedCandidate.interviewCredits
    };
  } catch (error) {
    console.error("Error consuming interview credit:", error);
    return {
      success: false,
      creditsRemaining: 0,
      message: "Error processing interview credit"
    };
  }
}

/**
 * Get candidate by user ID for auth middleware
 */
export async function getCandidateByUserId(userId: string) {
  try {
    return await prisma.candidate.findUnique({
      where: { userId },
      select: { 
        id: true, 
        interviewCredits: true,
        firstName: true,
        lastName: true
      }
    });
  } catch (error) {
    console.error("Error getting candidate by user ID:", error);
    return null;
  }
}
