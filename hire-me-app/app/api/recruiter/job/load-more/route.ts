import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const id = session?.user?.id;
    
    // Check if recruiter profile exists, if not create one
    let recruiter = await prisma.recruiter.findUnique({
      where: { userId: id },
    });
    
    if (!recruiter) {
      recruiter = await prisma.recruiter.create({
        data: { userId: id }
      });
    }
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const jobs = await prisma.job.findMany({
      where: {
        isDelete: false,
        recruiterId: recruiter.id,
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
