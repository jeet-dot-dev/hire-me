// app/candidate/loading.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-background/60 backdrop-blur-md border-border/20 shadow-2xl rounded-2xl overflow-hidden relative">
          <div className="absolute right-4 top-4">
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>

          {/* Header Section */}
          <CardHeader className="relative p-6 pt-16 space-y-6">
            {/* Progress Loader */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-1/3 rounded" />
              <Skeleton className="h-2 w-full rounded" />
              <Skeleton className="h-3 w-2/5 rounded" />
            </div>

            {/* Basic Info */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-2/5 rounded" />
                <Skeleton className="h-5 w-1/4 rounded" />
                <Skeleton className="h-4 w-3/5 rounded" />
                <Skeleton className="h-4 w-2/5 rounded" />
                <div className="flex gap-3">
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="p-6 space-y-8">
            {/* Resume Section */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32 rounded" />
              <Card className="bg-muted/20 border-border/30 rounded-xl">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28 rounded" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-28 rounded-md" />
                </CardContent>
              </Card>
            </div>

            {/* Skills Section */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-40 rounded" />
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-7 w-20 rounded-md" />
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-36 rounded" />
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-muted/20 border border-border/30 rounded-xl p-4 flex items-start gap-4"
                  >
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/2 rounded" />
                      <Skeleton className="h-4 w-1/3 rounded" />
                      <Skeleton className="h-3 w-1/4 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
