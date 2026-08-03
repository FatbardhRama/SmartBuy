import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ProductGridSkeletonProps = {
  count?: number;
};

export function ProductGridSkeleton({
  count = 6,
}: ProductGridSkeletonProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, index) => (
        <Card key={index}>
          <Skeleton className="h-48 w-full rounded-none" />
          <CardHeader>
            <Skeleton className="h-5 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
