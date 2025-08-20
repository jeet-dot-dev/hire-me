import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationWithJob } from "@/types/applicationType";
import { redirect } from "next/navigation";
import React from "react";
import DashboardUI from "./DashboardUI";

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
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
    include: {
      education: true,
      skills: true,
      socials: true,
    },
  });

  if (!candidate) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Profile Not Found
          </h1>
          <p className="text-gray-400">Candidate profile not found.</p>
        </div>
      </div>
    );
  }

 const recentJobApplications = await prisma.jobApplication.findMany({
  where: { candidateId: candidate.id },
  include:{
    job: true
  },
  orderBy: { createdAt: "desc" }
});

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
