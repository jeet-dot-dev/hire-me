import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { id, status } = await req.json();


  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  if (typeof status !== "boolean") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Validate the job ID exists
  const jobExists = await prisma.job.findUnique({
    where: { id },
  }); 

  if (!jobExists) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }


  try {
    const job = await prisma.job.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, job });
  } catch (err) {
    console.error("Error updating job status:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
