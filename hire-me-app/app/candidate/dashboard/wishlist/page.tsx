import CandidateJobComp from '@/components/custom/Candidate/jobs/CandidateJobComp';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Bookmark } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

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
    isDelete:true
  };

  if (!session?.user || session.user.role !== 'CANDIDATE') {
    return<div className='text-destructive'>Error! Unauthorize</div>;;
  }

  const candidate = await prisma.candidate.findUnique({
    where: { userId: session?.user?.id },
  });

  console.log(candidate)



  if (!candidate) {
    return <div className='text-destructive'>Error! Candidate not found</div>;
  }

  const wishListedJobIds = candidate.wishListedJobs || [];

  const wishlistedJobs = await prisma.job.findMany({
    where: {
      id: {
        in: wishListedJobIds,
      },
    },
    take : 10 ,
    select : jobSelect
  });


if(wishlistedJobs.length === 0){
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6">
        <div className="relative mb-8">
          {/* Background subtle glow */}
          <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl scale-150"></div>
          
          {/* Icon container */}
          <div className="relative bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50">
            <Bookmark className="w-16 h-16 text-gray-500 mx-auto" />
            
            {/* Floating decorative elements */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gray-500/30 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>

        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-white">
            Your wishlist is empty
          </h2>
          
          <p className="text-gray-400 leading-relaxed">
            Discover amazing opportunities and save the jobs that catch your interest. 
            Build your perfect collection of dream positions.
          </p>
          
          {/* Action button */}
          <div className="pt-4">
  <Link 
    href="/candidate/dashboard/jobs" // or whatever your jobs page route is
    className="group cursor-pointer relative overflow-hidden bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-white/10 inline-flex items-center gap-2"
  >
    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    Explore Jobs
    
    {/* Button hover effect */}
    <div className="absolute inset-0 bg-black/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
  </Link>
</div>
        </div>

        {/* Bottom decorative elements */}
      </div>
    )
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
  )
};

export default Page;
