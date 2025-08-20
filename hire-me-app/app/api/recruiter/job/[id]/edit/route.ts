import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jobSchema } from "@/zod/job";
import { NextResponse } from "next/server";

export async function POST (req:Request,{params}:{params:Promise<{id:string}>}) {
   try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const parsedBody = jobSchema.safeParse(body);
    if(!parsedBody.success) {
      return NextResponse.json({ error: parsedBody.error.errors }, { status: 400 });
    }
    const { id } = await params;
    if(!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.user.id },
    });
    if (!recruiter) {
      return NextResponse.json({ error: "Recruiter not found" }, { status: 404 });
    }
    const job = await prisma.job.findUnique({
      where: { id },
    });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.recruiterId !== recruiter.id) {
      return NextResponse.json({ error: "Unauthorized to edit this job" }, { status: 403 });
    }
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        ...parsedBody.data,
      },
    });
    return NextResponse.json(updatedJob, { status: 200 });
   } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
   }
}