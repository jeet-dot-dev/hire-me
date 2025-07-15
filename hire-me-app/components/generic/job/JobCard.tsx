import { RecruiterJobCompProp } from "@/components/custom/recruiter/RecruiterJobComp";
import JobCardUi from "./jobCardUi";

// import { useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import {
//   Building2,
//   MapPin,
//   DollarSign,
//   MoreVertical,
//   Edit,
//   Trash2,
//   Heart,
//   Eye,
//   Send,
//   Clock
// } from 'lucide-react';

// import React from 'react'
// import { JobFormData } from '@/zod/job';

const JobCard = ({ jobs, role }: RecruiterJobCompProp) => {
  // console.log(jobs,role)

  //     const mockJobs = [
  //   {
  //     id: '1',
  //     jobTitle: 'Senior Frontend Developer',
  //     companyName: 'TechCorp Inc.',
  //     location: 'San Francisco, CA',
  //     salary: '$120,000 - $160,000',
  //     jobType: 'Remote',
  //     description: 'We are looking for a senior frontend developer...',
  //     skillsRequired: ['React', 'TypeScript', 'Next.js'],
  //     interviewDuration: 30,
  //     interviewInstruction: 'Technical interview followed by system design',
  //     tags: ['frontend', 'react', 'senior'],
  //     industry: 'Technology',
  //     jobLevel: 'SENIOR',
  //     experienceNeeded: 5,
  //     contact: 'hr@techcorp.com',
  //     createdAt: new Date(),
  //   },
  //   {
  //     id: '2',
  //     jobTitle: 'Full Stack Engineer',
  //     companyName: 'StartupXYZ',
  //     location: 'New York, NY',
  //     salary: '$90,000 - $130,000',
  //     jobType: 'Hybrid',
  //     description: 'Join our growing team as a full stack engineer...',
  //     skillsRequired: ['Node.js', 'React', 'PostgreSQL'],
  //     interviewDuration: 20,
  //     tags: ['fullstack', 'startup', 'growth'],
  //     industry: 'Fintech',
  //     jobLevel: 'MID',
  //     experienceNeeded: 3,
  //     createdAt: new Date(),
  //   },
  //   {
  //     id: '3',
  //     jobTitle: 'Software Engineering Intern',
  //     companyName: 'BigTech Solutions',
  //     location: 'Seattle, WA',
  //     jobType: 'Onsite',
  //     description: 'Summer internship program for software engineering students...',
  //     skillsRequired: ['Python', 'JavaScript', 'Git'],
  //     interviewDuration: 10,
  //     tags: ['internship', 'entry-level', 'summer'],
  //     industry: 'Technology',
  //     jobLevel: 'INTERN',
  //     createdAt: new Date(),
  //   },
  // ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white">Job Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => {
          return <JobCardUi key={index} job={job} role={role} />;
        })}
      </div>
    </div>
  );
};

export default JobCard;
