
import { AppHeaderSkeleton } from '@/components/AppHeaderSkeleton';
import { PageContentSkeleton } from '@/components/PageContentSkeleton';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeaderSkeleton />
      <PageContentSkeleton cardCount={4} />
    </div>
  );
}
