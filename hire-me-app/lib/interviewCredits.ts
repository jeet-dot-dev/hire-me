import { prisma } from "@/lib/prisma";

export interface InterviewCreditsResult {
  success: boolean;
  creditsRemaining: number;
  message?: string;
}

/**
 * Check if a candidate has remaining interview credits
 */
export async function checkInterviewCredits(candidateId: string): Promise<InterviewCreditsResult> {
  try {
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

    const creditsRemaining = candidate.interviewCredits;

    if (creditsRemaining <= 0) {
      return {
        success: false,
        creditsRemaining: 0,
        message: "Free tier limit reached. Please upgrade to continue."
      };
    }

    return {
      success: true,
      creditsRemaining
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
    // First check if credits are available
    const checkResult = await checkInterviewCredits(candidateId);
    if (!checkResult.success) {
      return checkResult;
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
 * Get candidate's current interview credits
 */
export async function getCandidateCredits(candidateId: string): Promise<number> {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      select: { interviewCredits: true }
    });

    return candidate?.interviewCredits ?? 0;
  } catch (error) {
    console.error("Error getting candidate credits:", error);
    return 0;
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
