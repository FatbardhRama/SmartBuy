import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 sm:pt-12" aria-busy="true" aria-label="Loading cart">
      <div className="mb-10 space-y-3"><Skeleton className="h-4 w-24" /><Skeleton className="h-12 w-64 max-w-full" /><Skeleton className="h-4 w-36" /></div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          {Array.from({ length: 2 }, (_, index) => (
            <Card key={index} className="rounded-2xl border-0 ring-1 ring-border/80">
              <CardContent className="flex gap-5 p-5">
                <Skeleton className="h-32 w-32 shrink-0 rounded-xl sm:h-36 sm:w-36" />
                <div className="flex flex-1 flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-28 rounded-xl" />
                    <Skeleton className="h-9 w-20 rounded-lg" />
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

        <Card className="h-fit rounded-2xl border-0 ring-1 ring-border/80">
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
