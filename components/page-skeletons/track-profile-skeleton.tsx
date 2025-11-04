"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TrackProfileSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative h-[400px] sm:rounded-tl-2xl rounded-none md:h-[500px] bg-gradient-to-b from-primary/20 to-background overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Skeleton className="w-full h-full" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
            {/* Album Image Skeleton */}
            <div className="relative">
              <Skeleton className="h-48 w-48 md:h-64 md:w-64 rounded-lg border-2 border-background shadow-2xl" />
            </div>

            {/* Track Info Skeleton */}
            <div className="flex-1 text-center md:text-left space-y-4 w-full md:w-auto">
              <div>
                <Skeleton className="h-4 w-20 mb-2 mx-auto md:mx-0" />
                <Skeleton className="h-12 md:h-16 w-64 md:w-96 mb-4 mx-auto md:mx-0" />
                <Skeleton className="h-5 w-48 mb-2 mx-auto md:mx-0" />
              </div>

              {/* Stats Skeleton */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Actions Skeleton */}
              <div className="flex gap-3 justify-center md:justify-start pt-2">
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

