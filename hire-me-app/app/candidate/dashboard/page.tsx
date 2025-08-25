import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationWithJob } from "@/types/applicationType";
import { redirect } from "next/navigation";
import React from "react";
import DashboardUI from "./DashboardUI";
import { ensureCandidateProfile, isProfileComplete } from "@/lib/candidateUtils";
import { SimpleDashboard } from "@/components/shared/SimpleDashboard";

type TranscriptMessage = {
  role: "recruiter" | "candidate";
  text: string;
};

const page = async () => {
  const session = await auth();
  if (!session || !session.user) {
    return redirect("/auth/login");
  }

  const userId = session?.user?.id;
  
  // Ensure candidate profile exists, create if missing
  const candidate = await ensureCandidateProfile(
    userId, 
    session.user.email || undefined, 
    session.user.name || undefined
  );

  if (!candidate) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Error Creating Profile
          </h1>
          <p className="text-gray-400">
            We encountered an error setting up your profile. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // Check if candidate has any applications first
  const recentJobApplications = await prisma.jobApplication.findMany({
    where: { candidateId: candidate.id },
    include:{
      job: true
    },
    orderBy: { createdAt: "desc" }
  });

  // Check if profile is complete OR if user has applications (has engaged with platform)
  if (!isProfileComplete(candidate) && recentJobApplications.length === 0) {
    // Get recent jobs count for display
    const recentJobsCount = await prisma.job.count({
      where: { 
        status: true,
        isDelete: false 
      }
    });

    return (
      <SimpleDashboard 
        userName={candidate.firstName || session.user.name || "there"}
        recentJobsCount={recentJobsCount}
      />
    );
  }

 const recentJobPostings = await prisma.job.findMany({
  orderBy: { createdAt: "desc" }
});

  // Type cast the Prisma results to match our TypeScript types
  const typedApplications: ApplicationWithJob[] = recentJobApplications.map(app => ({
    ...app,
    transcript: app.transcript as TranscriptMessage[] | null, // Cast Prisma Json to our expected type
  }));

  return <DashboardUI recentJobApplications={typedApplications} recentJobPostings={recentJobPostings}  role="candidate" />;
};

export default page;
