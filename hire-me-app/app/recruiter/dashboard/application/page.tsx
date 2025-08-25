import ApplicationUI from "@/app/candidate/dashboard/application/ApplicationUI";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import React from "react";
import { ApplicationWithJob, TranscriptMessage } from "@/types/applicationType";


const page = async () => {
  const session = await auth();
  if (!session?.user || session?.user.role !== "RECRUITER") {
    return (
      <div>
        <h1>Unauthorized</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // Check if recruiter profile exists, if not create one
  let recruiter = await prisma.recruiter.findUnique({
    where: {
      userId: session.user.id,
    },
  });
  
  if (!recruiter) {
    recruiter = await prisma.recruiter.create({
      data: { userId: session.user.id }
    });
  }

  // Fetch applications for the recruiter

  const applications = await prisma.jobApplication.findMany({
    where: {
      job: {
        recruiterId: recruiter.id,
      },
    },
    include: {
      job: true, // if you want job details
    },
    orderBy: { createdAt: "desc" },
  });

  if (!applications || applications.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              No Applications Yet
            </h1>
            <p className="text-gray-400 mb-6 leading-relaxed">
              You haven&apos;t received any applications for your job postings yet. 
              Start by creating compelling job posts to attract talented candidates.
            </p>
          </div>
          

          
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              💡 Tip: Jobs with clear requirements and competitive benefits get more applications
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Type cast the applications to handle the transcript field properly
  const typedApplications = applications.map(app => ({
    ...app,
    transcript: app.transcript as TranscriptMessage[] | null
  })) as ApplicationWithJob[];

  return <ApplicationUI applications={typedApplications} role="recruiter" />;
};

export default page;
