import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { jobId, resumeUrl } = await req.json();
    if (!jobId || !resumeUrl) {
      return NextResponse.json(
        { error: "Job ID and Resume URL are required" },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        resumeUrl,
        candidateId: candidate.id,
        status: "Pending",
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.log("Error parsing request body:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
