import { Skeleton } from "../ui/skeleton";

export default function AppHeaderSkeleton() {
  return (
    <header className="flex h-14 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 px-3 sm:px-4 justify-between w-full">
        <div className="flex items-center gap-3 sm:gap-3 flex-1 min-w-0">
          <Skeleton className="h-9 w-9 shrink-0" />
          <div className="min-w-0 flex-1 hidden sm:block">
            <Skeleton className="h-6 w-48 max-w-full" />
          </div>
        </div>

        {/* Right side - Responsive layout */}
        <div className="flex items-center gap-3 shrink-0">
          <Skeleton className="h-9 w-48 shrink-0" />
          <Skeleton className="h-9 w-9 shrink-0" />
          <Skeleton className="h-9 w-9 shrink-0" />
        </div>
      </div>
    </header>
  )
}
