import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CandidateJobComp from "@/components/custom/Candidate/jobs/CandidateJobComp";

const page = async () => {
  const session = await auth();
  if (!session?.user) return redirect("/auth/login");

  const { id: userId, role } = session.user;

  const candidate = await prisma.candidate.findUnique({
    where: { userId },
  });

  if (!candidate) {
    return (
      <div className="text-red-500 text-center mt-10">
        Candidate profile not found.
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
