// app/loading.tsx
"use client";

import FullScreenLoader from "@/components/loaders/FullScreenLoader";
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
        <FullScreenLoader />
      </div>
    </div>
    </div>
  );
}
