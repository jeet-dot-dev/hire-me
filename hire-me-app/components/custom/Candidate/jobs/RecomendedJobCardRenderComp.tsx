"use client";
import JobCardView from '@/components/generic/job/JobCardView';
import { JobFormDataUI } from '@/zod/job';
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'sonner';

type RecomendedJobCardRenderCompProp = {
  jobs: JobFormDataUI[];
  role: "CANDIDATE" | "RECRUITER";
  wishListedJobs : string[];
  isWishlistPage : boolean
};

const RecomendedJobCardRenderComp = ({ jobs, role ,wishListedJobs}: RecomendedJobCardRenderCompProp) => {
  const [wishlistedJobIds, setWishlistedJobIds] = useState<string[]>(wishListedJobs);






const toggleWishlist = async (jobId: string) => {
  const toastId = toast.loading("Updating wishlist...");

  try {
    const response = await axios.post("/api/candidate/wishlist", { JobId: jobId });
    const updatedWishlist: string[] = response.data.wishListedJobs;

    const isWishlisted = updatedWishlist.includes(jobId);
    setWishlistedJobIds(updatedWishlist);

   toast.success(
  isWishlisted
    ? "Added to wishlist! Please refresh the page to see changes."
    : "Removed from wishlist. Refresh to update your list.",
  { id: toastId }
);

  } catch (error) {
    toast.error("Failed to update wishlist", { id: toastId });
    console.error("Failed to toggle wishlist:", error);
  }
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
