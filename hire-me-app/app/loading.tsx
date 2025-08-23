// app/loading.tsx
"use client";

import FullScreenLoader from "@/components/loaders/FullScreenLoader";

export default function Loading() {
  return (
    <div className="dark">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <FullScreenLoader />

        {/* Main Content */}
      </div>
    </div>
  );
}
