import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");

  try {
    const jobs = await prisma.job.findMany({
      where: {
        isDelete: false,
        status: true,
        ...(cursor && { createdAt: { lt: new Date(cursor as string) } }),
      },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        jobTitle: true,
        companyName: true,
        location: true,
        salary: true,
        jobType: true,
        description: true,
        skillsRequired: true,
        interviewDuration: true,
        interviewInstruction: true,
        tags: true,
        industry: true,
        jobLevel: true,
        experienceNeeded: true,
        contact: true,
        expireAt: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        isDelete: true,
      },
    });

    if (!jobs || jobs.length === 0) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
    return new Response(JSON.stringify(jobs), { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch jobs" }), {
      status: 500,
    });
  }
}
