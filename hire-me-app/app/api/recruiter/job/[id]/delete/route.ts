import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await auth();

  if (
    !session ||
    !session.user ||
    !session.user.id ||
    session.user.role !== "RECRUITER"
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!id) {
    return new Response("Job ID is required", { status: 400 });
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id },
    });
    if (!job) {
      return new Response("Job not found", { status: 404 });
    }
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.user.id },
    });
    if (!recruiter || recruiter.id !== job.recruiterId) {
      return new Response("Unauthorized to delete this job", { status: 403 });
    }
    await prisma.job.update({
      where: { id },
      data: { isDelete: true },
    });
    return new Response("Job deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting job:", error);
    return new Response("Failed to delete job", { status: 500 });
  }
}
