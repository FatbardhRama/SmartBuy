import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="container mx-auto px-6 py-10" aria-busy="true" aria-label="Loading cart">
      <Skeleton className="mb-8 h-10 w-48" />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {Array.from({ length: 2 }, (_, index) => (
            <Card key={index}>
              <CardContent className="flex gap-5 p-6">
                <Skeleton className="h-32 w-32 shrink-0" />
                <div className="flex flex-1 flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10" />
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="size-10" />
                  </div>
                </div>
                <div className="hidden flex-col items-end justify-between gap-8 sm:flex">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardContent className="space-y-5 p-6">
            <Skeleton className="h-7 w-40" />
            <div className="flex justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
