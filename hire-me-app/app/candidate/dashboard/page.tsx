import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import DashboardUI from "./DashboardUI";

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
  orderBy: { createdAt: "desc" }
});

 const recentJobPostings = await prisma.job.findMany({
  take:5,
  orderBy : {createdAt : "desc"}
 })

 
 
  return <DashboardUI recentJobApplications={recentJobApplications} recentJobPostings={recentJobPostings} />;
};

export default page;
