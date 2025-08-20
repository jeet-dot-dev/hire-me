"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const RecruiterApplicationSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col p-4 sm:p-6">
      {/* Header Section */}
      <section className="flex items-center gap-3 sm:gap-4 mb-6">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10 rounded-full cursor-pointer"
          size="icon"
          disabled
        >
          <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>

        <div className="flex-1">
          <Skeleton className="h-6 sm:h-7 w-40 sm:w-60 mb-2 rounded-md" />
          <Skeleton className="h-4 w-28 sm:w-40 rounded-md" />
        </div>
      </section>

      {/* Job Details Card */}
      <section className="bg-zinc-900/80 p-4 sm:p-6 rounded-2xl shadow-lg shadow-black/30 flex flex-col lg:flex-row justify-between gap-6 border border-zinc-800">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 sm:h-6 w-40 sm:w-56 rounded-md" />
          <Skeleton className="h-4 w-28 sm:w-40 rounded-md" />

          <Skeleton className="h-6 w-20 rounded-full mt-2" />

          <div className="mt-4 sm:mt-6 space-y-3 text-xs sm:text-sm">
            <Skeleton className="h-4 w-60 sm:w-80 rounded-md" />
            <Skeleton className="h-4 w-44 rounded-md" />
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
        </div>

        {/* Scores */}
        <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end gap-4 w-full lg:w-auto">
          <div className="text-center lg:text-right flex-1">
            <Skeleton className="h-3 w-28 mx-auto lg:ml-auto mb-2 rounded-md" />
            <Skeleton className="h-2 w-44 rounded-full" />
            <Skeleton className="h-4 w-10 mx-auto lg:ml-auto mt-1 rounded-md" />
          </div>

          <div className="text-center lg:text-right flex-1">
            <Skeleton className="h-3 w-28 mx-auto lg:ml-auto mb-2 rounded-md" />
            <Skeleton className="h-2 w-44 rounded-full" />
            <Skeleton className="h-4 w-10 mx-auto lg:ml-auto mt-1 rounded-md" />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mt-6">
        {/* Tabs header */}
        <div className="flex gap-2 mb-4 sm:mb-6">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>

        {/* Tabs content */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <Skeleton className="h-4 w-4/6 rounded-md" />
          <Skeleton className="h-4 w-3/6 rounded-md" />
          <Skeleton className="h-4 w-2/6 rounded-md" />
        </div>
      </section>
    </div>
  );
};

export default RecruiterApplicationSkeleton;
