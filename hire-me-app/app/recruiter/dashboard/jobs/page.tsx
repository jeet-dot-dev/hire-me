import RecruiterJobComp from "@/components/features/recruiter/RecruiterJobComp";
import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const page = async () => {
  const session = await auth();

  if (!session?.user) {
    return redirect("/auth/login");
  }

  const { id: userId, role } = session.user;
  
  // Check if recruiter profile exists, if not create one
  let recruiter = await prisma.recruiter.findUnique({ where: { userId } });

  if (!recruiter) {
    recruiter = await prisma.recruiter.create({
      data: { userId }
    });
  }

 const jobs = await prisma.job.findMany({
  where: {
    recruiterId: recruiter.id,
    isDelete: false,
  },
  take: 12,
  orderBy: {
    createdAt: "desc",
  },
  select: {
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
    status:true,
    //recruiterId: true,
    // isDelete: false // ← don't include this to "exclude" it
  },
});


  return (
    <div>
      <RecruiterJobComp jobs={jobs} role={role} />
    </div>
  );
};

export default page;
