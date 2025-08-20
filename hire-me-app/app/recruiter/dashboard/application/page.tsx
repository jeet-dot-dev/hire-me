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

  const recruiter = await prisma.recruiter.findUnique({
    where: {
      userId: session.user.id,
    },
  });
  if (!recruiter) {
    return (
      <div>
        <h1>Recruiter Not Found</h1>
        <p>Please ensure you are registered as a recruiter.</p>
      </div>
    );
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
      <div>
        <h1>No Applications Found</h1>
        <p>There are currently no applications for your jobs.</p>
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
