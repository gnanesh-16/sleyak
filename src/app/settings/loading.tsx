
import { AppHeaderSkeleton } from '@/components/AppHeaderSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeaderSkeleton />
      <main className="flex-grow container mx-auto p-6">
        <Skeleton className="h-10 w-1/4 mb-8 rounded-md" /> {/* Settings Title */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <nav className="md:w-1/4 lg:w-1/5 space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-md" />
            ))}
          </nav>
          {/* Content Area Skeleton */}
          <div className="md:w-3/4 lg:w-4/5">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </main>
    </div>
  );
}
