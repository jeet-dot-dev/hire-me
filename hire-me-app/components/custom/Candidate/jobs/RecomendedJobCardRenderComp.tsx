"use client";
import JobCardView from "@/components/generic/job/JobCardView";
import { JobFormDataUI } from "@/zod/job";
import axios from "axios";
import { Loader } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type RecomendedJobCardRenderCompProp = {
  jobs: JobFormDataUI[];
  role: "CANDIDATE" | "RECRUITER";
  wishListedJobs: string[];
  isWishlistPage: boolean;
  enableInfiniteScroll: boolean;
  isFilterON: boolean;
};

const RecomendedJobCardRenderComp = ({
  jobs,
  role,
  wishListedJobs,
  enableInfiniteScroll = false,
  isWishlistPage,
  isFilterON,
}: RecomendedJobCardRenderCompProp) => {
  const [wishlistedJobIds, setWishlistedJobIds] =
    useState<string[]>(wishListedJobs);

  const [allJobs, setAllJobs] = useState<JobFormDataUI[]>(jobs);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  //console.log("hi i am renderd", allJobs.length);

  const fetchMoreJobs = useCallback(async () => {
    if (isWishlistPage) return;
    const lastJob = allJobs[allJobs.length - 1];
    if (!lastJob) {
      return;
    }
    try {
      const res = await axios.get("/api/jobs/load-more", {
        params: { cursor: lastJob.createdAt },
      });

      const newJobs: JobFormDataUI[] = res.data;
      if (newJobs.length === 0) {
        setHasMore(false);
        return;
      }
      setAllJobs((prev) => [...prev, ...newJobs]);
    } catch (err) {
      console.error("Error fetching more jobs:", err);
    }
  }, [allJobs, isWishlistPage]);

  useEffect(() => {
    if (!isFilterON) {
      setAllJobs(jobs);
    }
  }, [jobs, isFilterON]);

  useEffect(() => {
    if (!enableInfiniteScroll || isWishlistPage || isFilterON) return;
    const target = observerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreJobs();
        }
      },
      { threshold: 1 }
    );

    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [
    fetchMoreJobs,
    hasMore,
    enableInfiniteScroll,
    isWishlistPage,
    isFilterON,
    jobs,
  ]);

  const toggleWishlist = async (jobId: string) => {
    const toastId = toast.loading("Updating wishlist...");

    try {
      const response = await axios.post("/api/candidate/wishlist", {
        JobId: jobId,
      });
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
        {allJobs.map((job) => (
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

      {hasMore && enableInfiniteScroll && !isWishlistPage && !isFilterON && (
        <div
          ref={observerRef}
          className="h-10 mt-4 flex items-center justify-center"
        >
          <div className="flex items-center gap-2 text-sm text-white animate-pulse">
            <Loader className="w-4 h-4 animate-spin text-white" />
            <span>Loading more jobs...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default RecomendedJobCardRenderComp;
