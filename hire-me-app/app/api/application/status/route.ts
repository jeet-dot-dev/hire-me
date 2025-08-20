import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { applicationId, status } = await req.json();

        if (!applicationId || !status) {
            return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
        }

        await prisma.jobApplication.update({where:{id: applicationId}, data: {status}});

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Error updating application status:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}