"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function JobViewSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-white">
      {/* Top actions */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" className="px-2" disabled>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>

      {/* Job details */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 rounded-md" /> {/* Title */}
        <Skeleton className="h-4 w-48 rounded-md" /> {/* Company + Location */}

        {/* Grid details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-40 rounded-md" />
          ))}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <Skeleton className="h-6 w-40 mb-2 rounded-md" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-48 rounded-md" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full rounded-md" />
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 space-y-2">
          <Skeleton className="h-6 w-56 rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>

        {/* Tags */}
        <div className="mt-6">
          <Skeleton className="h-6 w-32 mb-2 rounded-md" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-16 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
