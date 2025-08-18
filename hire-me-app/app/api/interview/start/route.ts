// /app/api/interview/start/route.ts
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { applicationId } = await req.json();

    if (!applicationId) {
      return new Response(
        JSON.stringify({ error: "Missing applicationId" }),
        { status: 400 }
      );
    }

    // Update application record
    const updatedApp = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { isInterviewDone: true },
    });

    return new Response(
      JSON.stringify({ success: true, application: updatedApp }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error starting interview:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
