import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jobSchema } from "@/zod/job";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsedBody = jobSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.flatten() },
        { status: 400 }
      );
    }
   const userId = session?.user?.id;
    // check if he user have a recruiter profile or not if not then create on 
    let recruiter = await prisma.recruiter.findUnique({where : {userId}});

    if(!recruiter){
        recruiter = await prisma.recruiter.create({data:{userId}})
    }

    const job = await prisma.job.create({data:{
        ...parsedBody.data,recruiterId:recruiter.id
    }})

    return NextResponse.json({message: "Job created successfully", job}, { status: 201 });

  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
