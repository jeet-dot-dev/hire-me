import { extractResumeText } from "@/components/interview/functions/extractResumeText";
import { getResumeAnalysis } from "@/components/interview/functions/getResFromAi";
import ErrorAnimation from "@/components/scaleton-loaders/ErrorAnimation";
import { prisma } from "@/lib/prisma";
import React from "react";
import ResumeResult from "./resumeResult";

type Props = {
  params: {
    id: string;
  };
};

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

const Page = async ({ params }: Props) => {
  const { id } = await params;

  if (!id) {
    return (
      <ErrorAnimation msg="We couldn’t find this application. Please check the link or go back to your dashboard." />
    );
  }

  // 1️⃣ Fetch the application
  const application = await prisma.jobApplication.findUnique({ where: { id } });

  if (!application) {
    return (
      <ErrorAnimation msg="We couldn’t find this application. Please check the link or go back to your dashboard." />
    );
  }

  // 2️⃣ Fetch the job
  const job = await prisma.job.findUnique({
    where: { id: application.jobId },
    select: jobSelect,
  });

  if (!job) {
    return (
      <ErrorAnimation msg="This job is no longer available or may have been removed." />
    );
  }

  // 3️⃣ If already processed, show results immediately
  if (
    application.score !== null &&
    application.resumeText &&
    application.resumeOverview
  ) {
    return (
      <ResumeResult
        job={job}
        application={application}
      />
    );
  }

  // 4️⃣ Extract resume text if missing
  let resumeText = application.resumeText;
  if (!resumeText) {
    resumeText = await extractResumeText(application.resumeUrl);
    if (!resumeText) {
      return (
        <ErrorAnimation msg="Our analysis service is temporarily unavailable. Please try again in a few minutes." />
      );
    }
    await prisma.jobApplication.update({
      where: { id },
      data: { resumeText },
    });
  }

  // 5️⃣ Get AI analysis if missing
  const analysisResult = await getResumeAnalysis(resumeText, {
    description: job.description || "",
    skillsRequired: job.skillsRequired || [],
  });

  if (!analysisResult) {
    return (
      <ErrorAnimation msg="We couldn’t process your resume right now. Please try again later." />
    );
  }

 await prisma.jobApplication.update({
    where: { id },
    data: {
      score: analysisResult.score,
      resumeOverview: analysisResult.resumeOverview,
      matchedSkills: analysisResult.matchedSkills,
      unmatchedSkills: analysisResult.unmatchedSkills,
    },
  });

  // refetch the updated results 
  const updatedApplication = await prisma.jobApplication.findUnique({
  where: { id },
});
  // 6️⃣ Return fresh results
  return (
    <ResumeResult
    job={job}
    application={updatedApplication!}
    />
  );
};

export default Page;
