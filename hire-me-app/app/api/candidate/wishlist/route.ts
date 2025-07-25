import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "CANDIDATE")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { JobId } = await req.json();
    if (!JobId) {
      return NextResponse.json({ error: "JobId is required" }, { status: 400 });
    }
    const candidate = await prisma.candidate.findUnique({
      where: { userId: session.user.id },
    });
    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }
    const existingWishlist = candidate.wishListedJobs || [];
    let wishListedJobs = [...existingWishlist];
    if (wishListedJobs.includes(JobId)) {
      // Remove from wishlist
      wishListedJobs = wishListedJobs.filter((id) => id !== JobId);
    } else {
      // Add to wishlist
      wishListedJobs.push(JobId);
    }
    const updatedCandidate = await prisma.candidate.update({
      where: { id: candidate.id },
      data: { wishListedJobs },
    });
    return NextResponse.json({
      wishListedJobs: updatedCandidate.wishListedJobs,
    });
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
