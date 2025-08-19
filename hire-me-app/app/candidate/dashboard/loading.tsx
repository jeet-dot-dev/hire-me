"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function loading() {
  return (
    <div className="bg-black text-white min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-8 sm:h-10 w-72 rounded-lg mb-2" />
        <Skeleton className="h-4 w-52 rounded-lg mb-2" />
        <Separator className="bg-gray-700 mt-4" />
      </div>

      {/* Stats Section */}
      <section className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col justify-between h-32 sm:h-40"
          >
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-6 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </section>

      {/* Recent Applications and Job Postings */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg space-y-3"
          >
            <Skeleton className="h-6 w-48 mb-4" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="p-3 bg-[#0f0f10] rounded-lg space-y-2"
              >
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-full rounded" />
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* Quick Actions Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg"
          >
            <Skeleton className="h-5 w-40 mb-3" />
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </section>

      {/* Additional Insights */}
      <section className="mt-8">
        <div className="bg-[#18181a] p-4 sm:p-6 rounded-2xl shadow-lg">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 bg-[#0f0f10] rounded-lg">
                <Skeleton className="h-6 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
