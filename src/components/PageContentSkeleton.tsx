
"use client";

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export function PageContentSkeleton({ cardCount = 4 }: { cardCount?: number }) {
  return (
    <main className="flex-grow container mx-auto p-6 space-y-8">
      {/* Page Title Skeleton */}
      <Skeleton className="h-10 w-1/3 rounded-md" />

      {/* Card Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: cardCount }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full rounded-md" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-1/3 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Another section example */}
      <Card>
        <CardHeader>
            <Skeleton className="h-7 w-1/2 rounded-md" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-3/4 rounded-md" />
        </CardContent>
      </Card>
    </main>
  );
}
