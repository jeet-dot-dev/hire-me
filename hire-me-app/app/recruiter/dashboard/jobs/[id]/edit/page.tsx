import CreateJobForm from "@/components/features/recruiter/CreateJobForm";
import { prisma } from "@/lib/prisma";
import React from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const page = async ({ params }: Props) => {
  const { id } = await params;

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
};

 const job = await prisma.job.findUnique({
  where: { id },
  select: jobSelect,
});

if (!job) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-semibold text-red-600 mb-2">Job not found</h2>
      <p className="text-gray-500">The job you’re trying to edit doesn&apos;t exist or has been removed.</p>
    </div>
  );
}


  console.log(job);


  return <CreateJobForm job={job} type="Edit"/>;
};

export default page;
