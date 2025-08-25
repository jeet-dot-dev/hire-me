import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CandidateJobComp from "@/components/features/Candidate/jobs/CandidateJobComp";
import { ensureCandidateProfile } from "@/lib/candidateUtils";

const page = async () => {
  const session = await auth();
  if (!session?.user) return redirect("/auth/login");

  const { id: userId, role } = session.user;

  // Ensure candidate profile exists, create if missing
  const candidate = await ensureCandidateProfile(
    userId, 
    session.user.email || undefined, 
    session.user.name || undefined
  );

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            Error Creating Profile
          </h1>
          <p className="text-muted-foreground">
            We encountered an error setting up your profile. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // Get skills as string array
  const skills = await prisma.skill.findMany({
    where: { candidateId: candidate.id },
    select: { name: true },
  });
  const skillString = skills.map((skill) => skill.name);

  // Shared select structure
  const jobSelect = {
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
  };

  // 1. All Jobs
  const jobs = await prisma.job.findMany({
    where: { isDelete: false, status: true },
    orderBy: { createdAt: "desc" },
    take: 12,
    select: jobSelect,
  });

  // 2. Recommended Jobs
  const recommendedJobs = await prisma.job.findMany({
    where: {
      isDelete: false,
      status: true,
      skillsRequired: {
        hasSome: skillString,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: jobSelect,
  });

  // 3. Recently Posted Jobs (last 7 days)
  const recentJobs = await prisma.job.findMany({
    where: {
      isDelete: false,
      status: true,
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: jobSelect,
  });

  return (
    <div>
      <CandidateJobComp
        jobs={jobs}
        recommendedJobs={recommendedJobs}
        recentJobs={recentJobs}
        role={role}
        wishListedJobs={candidate.wishListedJobs}
        isWishlistPage={false}
      />
    </div>
  );
};

export default page;
