import DashboardUI from "@/app/candidate/dashboard/DashboardUI";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationWithJob } from "@/types/applicationType";
import { redirect } from "next/navigation";
import React from "react";

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
  
  // Check if recruiter profile exists, if not create one
  let recruiter = await prisma.recruiter.findUnique({
    where: { userId },
  });

  if (!recruiter) {
    recruiter = await prisma.recruiter.create({
      data: { userId }
    });
  }

 const recentJobApplications = await prisma.jobApplication.findMany({
  where: { job: { recruiterId: recruiter.id } },

  include: {
    job: true,
  },
  orderBy: { createdAt: "desc" }
});


 const recentJobPostings = await prisma.job.findMany({
  where: { recruiterId: recruiter.id },

  orderBy: { createdAt: "desc" }
 });

  // Type cast the Prisma results to match our TypeScript types
  const typedApplications: ApplicationWithJob[] = recentJobApplications.map(app => ({
    ...app,
    transcript: app.transcript as TranscriptMessage[] | null, // Cast Prisma Json to our expected type
  }));

  return <DashboardUI recentJobApplications={typedApplications} recentJobPostings={recentJobPostings} role="recruiter" />;
};

export default page;
