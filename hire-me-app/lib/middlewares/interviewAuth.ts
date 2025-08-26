import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getCandidateByUserId } from "@/lib/interviewCredits";

export interface AuthenticatedRequest extends NextRequest {
  candidate?: {
    id: string;
    interviewCredits: number;
    firstName: string;
    lastName: string;
  };
}

/**
 * Middleware to protect interview-related API routes
 * Checks authentication and interview credits
 */
export async function withInterviewCreditsCheck(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<Response>
): Promise<Response> {
  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get candidate profile
    const candidate = await getCandidateByUserId(token.sub);
    
    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate profile not found" },
        { status: 404 }
      );
    }

    // Check interview credits
    if (candidate.interviewCredits <= 0) {
      return NextResponse.json(
        { 
          error: "Free tier limit reached. Please upgrade to continue.",
          creditsRemaining: 0,
          upgradeRequired: true
        },
        { status: 402 } // Payment Required
      );
    }

    // Add candidate info to request for use in handlers
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.candidate = candidate;

    // Call the actual handler
    return await handler(authenticatedRequest);
    
  } catch (error) {
    console.error("Interview credits middleware error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Simple authentication check for non-credit-consuming routes
 */
export async function withAuthCheck(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<Response>
): Promise<Response> {
  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.sub) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get candidate profile
    const candidate = await getCandidateByUserId(token.sub);
    
    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate profile not found" },
        { status: 404 }
      );
    }

    // Add candidate info to request
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.candidate = candidate;

    return await handler(authenticatedRequest);
    
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
