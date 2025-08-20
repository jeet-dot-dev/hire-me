import { Skeleton } from "../ui/skeleton";

import React from 'react'

const JobCardLoader = () => {
  return (
    <div className="dark">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
  )
}

export default JobCardLoader
