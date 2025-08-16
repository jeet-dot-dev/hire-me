// app/loading.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="dark">
        <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-[240px] bg-muted p-4 space-y-4">
        <Skeleton className="h-6 w-24 rounded-md" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-5 w-32 rounded" />
        </div>
        <Skeleton className="h-5 w-24 rounded" />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-background p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-[300px] rounded" />
          <Skeleton className="h-5 w-[200px] rounded" />
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-full max-w-[90%] rounded" />
          <Skeleton className="h-10 w-24 rounded" />
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl border bg-card space-y-4">
              <Skeleton className="h-5 w-[70%] rounded" />
              <Skeleton className="h-4 w-[50%] rounded" />
              <Skeleton className="h-4 w-[60%] rounded" />

              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              <div className="flex justify-between pt-2">
                <Skeleton className="h-8 w-20 rounded" />
                <Skeleton className="h-8 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
