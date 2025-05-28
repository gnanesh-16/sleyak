
"use client";

import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background animate-pulse">
      {/* AppHeader Skeleton */}
      <header className="py-4 px-6 border-b bg-card shadow-sm sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded" /> {/* Icon */}
            <Skeleton className="h-7 w-48 rounded" /> {/* Title */}
          </div>
          <Skeleton className="h-9 w-9 rounded" /> {/* Theme Toggle */}
        </div>
      </header>

      {/* Filter/Action Bar Skeleton */}
      <div className="p-4 border-b">
        <div className="container mx-auto flex justify-end items-center gap-4">
          <Skeleton className="h-10 w-72 rounded-md" /> {/* Filter Input */}
        </div>
         <Skeleton className="h-3 w-3/4 mt-2 mx-auto rounded sm:w-1/2 md:w-1/3" /> {/* Tip text placeholder */}
      </div>

      {/* Main Content Area (Tabs + Cards) Skeleton */}
      <div className="flex flex-col flex-grow p-4 dots-background overflow-hidden">
        {/* Tabs List Skeleton */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-12 flex-grow rounded-md border" /> {/* ScrollArea for TabsList */}
          <Skeleton className="h-10 w-28 rounded-md" /> {/* Add Tab Button */}
        </div>

        {/* Tab Content Skeleton (Cards) */}
        <div className="flex-grow mt-2 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col">
                <Skeleton className="relative w-full aspect-[16/9] rounded-t-lg bg-muted" />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 flex-grow rounded" />
                  </div>
                  <Skeleton className="h-3 w-3/4 rounded mt-1" />
                </div>
                <div className="p-4 pt-0 mt-1">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 mt-2 rounded" />
                </div>
                <div className="p-4 pt-0 flex justify-between items-center mt-auto">
                  <Skeleton className="h-8 w-32 rounded-md" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
