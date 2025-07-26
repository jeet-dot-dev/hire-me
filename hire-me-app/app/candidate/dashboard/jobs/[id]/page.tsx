import JobViewPage from '@/components/generic/job/view/JobViewPage';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
  params: {
    id: string;
  };
};

const page =async({ params }: Props) => {
    const { id } = await params;
    const session = await auth();

    if(!session || !session.user || session?.user?.role !== "CANDIDATE"){
      redirect("/auth/login")
    }

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
  select : jobSelect ,
});

if (!job) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-semibold text-red-600 mb-2">Job not found</h2>
    </div>
  );
}
console.log(job)
  return (
   <JobViewPage job={job} role="CANDIDATE" />
  )
}

export default page
