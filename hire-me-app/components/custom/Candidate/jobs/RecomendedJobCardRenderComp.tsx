"use client";
import JobCardView from '@/components/generic/job/JobCardView';
import { JobFormDataUI } from '@/zod/job';
import React, { useState } from 'react';

type RecomendedJobCardRenderCompProp = {
  jobs: JobFormDataUI[];
  role: "CANDIDATE" | "RECRUITER";
};

const RecomendedJobCardRenderComp = ({ jobs, role }: RecomendedJobCardRenderCompProp) => {
  const [wishlistedJobIds, setWishlistedJobIds] = useState<string[]>([]);



  const toggleWishlist = (jobId: string) => {
    setWishlistedJobIds((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
      {jobs.map((job) => (
        <JobCardView
          key={job.id}
          job={job}
          role={role}
          isWishlisted={wishlistedJobIds.includes(job.id!)} // use `!` if you're sure id exists
          handleWishlist={() => toggleWishlist(job.id!)}
          showConfirmDialog={false}
          setShowConfirmDialog={() => {}}
          confirmDeactivate={() => {}}
          jobStatus={job.status}
          isExpired={false}
          daysRemaining={0}
        />
      ))}
    </div>
  );
};

export default RecomendedJobCardRenderComp;
