import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import ApplicatinUI from "./ApplicatinUI";
import Link from "next/link";



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

  const applications = await prisma.jobApplication.findMany({
    where: { candidateId: candidate.id },
    include: {
      job: {
        select: {
          id: true,
          jobTitle: true,
          companyName: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Show newest applications first
    },
  });

  if (!applications || applications.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-2">
            No Applications Yet
          </h1>
          <p className="text-gray-400 mb-6">
            You haven&apos;t submitted any job applications yet. Start exploring
            jobs and apply to get started!
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return <ApplicatinUI applications={applications} />;
};

export default page;
