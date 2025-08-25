import CandidateJobComp from "@/components/features/Candidate/jobs/CandidateJobComp";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ensureCandidateProfile } from "@/lib/candidateUtils";

const Page = async () => {
  const session = await auth();

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

  if (!session?.user || session.user.role !== "CANDIDATE") {
    return <div className="text-destructive">Error! Unauthorize</div>;
  }

  // Ensure candidate profile exists, create if missing
  const candidate = await ensureCandidateProfile(
    session.user.id, 
    session.user.email || undefined, 
    session.user.name || undefined
  );

  console.log(candidate);

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

  const wishListedJobIds = candidate.wishListedJobs || [];

  const wishlistedJobs = await prisma.job.findMany({
    where: {
      id: {
        in: wishListedJobIds,
      },
    },
    select: jobSelect,
  });

  if (wishlistedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6">
        <div className="relative mb-8">
          {/* Background subtle glow */}
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-150"></div>

          {/* Icon container */}
          <div className="relative bg-card backdrop-blur-sm rounded-2xl p-8 border border-border">
            <Bookmark className="w-16 h-16 text-muted-foreground mx-auto" />

            {/* Floating decorative elements */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-muted/50 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>

        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">
            Your wishlist is empty
          </h2>

          <p className="text-muted-foreground leading-relaxed">
            Discover amazing opportunities and save the jobs that catch your
            interest. Build your perfect collection of dream positions.
          </p>

          {/* Action button */}
          <div className="pt-4">
            <Link
              href="/candidate/dashboard/jobs" // or whatever your jobs page route is
              className="group cursor-pointer relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center gap-2"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Explore Jobs
              {/* Button hover effect */}
              <div className="absolute inset-0 bg-primary/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
          </div>
        </div>

        {/* Bottom decorative elements */}
      </div>
    );
  }
  return (
    <CandidateJobComp
      jobs={wishlistedJobs}
      recommendedJobs={[]}
      recentJobs={[]}
      role={session?.user?.role}
      wishListedJobs={candidate.wishListedJobs}
      isWishlistPage={true}
    />
  );
};

export default Page;
