import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardStatsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Title with Period Selector and Export Button */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Music Taste Profile - Radar Chart */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="space-y-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
        <div className="flex items-center justify-center h-96">
          <Skeleton className="h-72 w-72 rounded-full" />
        </div>
      </div>

      {/* Stats Grid - 4 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-20 mb-2" />
          </div>
        ))}
      </div>

      {/* Top Artists Section */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 overflow-auto max-h-[900px]">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="space-y-1">
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 overflow-auto max-h-[600px]">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid - Decade and Genres */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tracks by Decade Chart */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="space-y-1">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
          <div className="h-[300px] space-y-2">
            <Skeleton className="h-full w-full" />
          </div>
        </div>

        {/* Top Genres Chart */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="space-y-1">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <div className="h-[300px] space-y-2">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}