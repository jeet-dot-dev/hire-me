import { extractResumeText } from "@/components/interview/functions/extractResumeText";
import { getResumeAnalysis } from "@/components/interview/functions/getResFromAi";
import ErrorAnimation from "@/components/loaders/ErrorAnimation";
import { prisma } from "@/lib/prisma";
import React from "react";
import ResumeResult from "./resumeResult";

type Props = {
  params: Promise<{
    id: string;
  }>;
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

export default async function ApplicationPage({ params }: Props) {
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
    return <ResumeResult job={job} application={application} />;
  }

  // 4️⃣ Extract resume text if missing
  let resumeText = application.resumeText;
  if (!resumeText) {
    try {
      resumeText = await extractResumeText(application.resumeUrl);
     // console.log(resumeText)
      if (!resumeText) {
        return (
          <ErrorAnimation msg="Could not extract text from your resume. Please try uploading a different format (DOCX recommended)." />
        );
      }
      await prisma.jobApplication.update({
        where: { id },
        data: { resumeText },
      });
    } catch (error) {
      console.error("Resume extraction failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      // Provide specific error message based on the error type
      if (errorMessage.includes("Download timeout")) {
        return (
          <ErrorAnimation msg="Resume download timed out. Please check your internet connection and try again." />
        );
      } else if (errorMessage.includes("Resume file not found")) {
        return (
          <ErrorAnimation msg="Resume file not found. Please upload your resume again." />
        );
      } else if (errorMessage.includes("Access denied")) {
        return (
          <ErrorAnimation msg="Cannot access resume file. Please upload your resume again." />
        );
      } else if (errorMessage.includes("Unsupported file format")) {
        return (
          <ErrorAnimation msg="Unsupported file format. Please upload a PDF or DOCX file." />
        );
      } else if (errorMessage.includes("password protected")) {
        return (
          <ErrorAnimation msg="PDF file is password protected. Please upload an unprotected version." />
        );
      } else if (
        errorMessage.includes("image-based") ||
        errorMessage.includes("no readable text")
      ) {
        return (
          <ErrorAnimation msg="PDF contains no readable text or is image-based. Please upload a text-based PDF or DOCX file." />
        );
      } else {
        return (
          <ErrorAnimation msg="Could not process your resume. Please try uploading a different file or try again later." />
        );
      }
    }
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
  return <ResumeResult job={job} application={updatedApplication!} />;
}
