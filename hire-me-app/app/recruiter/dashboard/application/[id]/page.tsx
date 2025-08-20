import { prisma } from "@/lib/prisma";
import React from "react";
import RecruiterApplication from "./RecruiterApplication";
import { notFound } from "next/navigation";
import { ApplicationWithJob, TranscriptMessage } from "@/types/applicationType";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const application = await prisma.jobApplication.findUnique({
    where: {
      id: id,
    },
    include: {
      job: true,
    },
  });
  
  if (!application) {
    notFound();
  }
  
  // Type cast the application to handle the transcript field properly
  const typedApplication = {
    ...application,
    transcript: application.transcript as TranscriptMessage[] | null
  } as ApplicationWithJob;
  
  return <RecruiterApplication application={typedApplication} />;
};

export default page;
