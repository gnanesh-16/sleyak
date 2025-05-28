
"use client";

import { Skeleton } from '@/components/ui/skeleton';

export function AppHeaderSkeleton() {
  return (
    <header className="py-4 px-6 border-b bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Skeleton (visible on md:hidden in actual header) */}
          <Skeleton className="h-8 w-8 rounded md:hidden" /> 
          {/* Logo Skeleton */}
          <Skeleton className="h-7 w-7 rounded-full" /> 
          {/* App Name Skeleton */}
          <Skeleton className="h-6 w-24 rounded" /> 
        </div>

        {/* Desktop Nav Links Skeleton (hidden on md:flex in actual header) */}
        <div className="hidden md:flex items-center gap-4">
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-5 w-20 rounded" />
        </div>

        {/* Theme Toggle Skeleton */}
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </header>
  );
}
