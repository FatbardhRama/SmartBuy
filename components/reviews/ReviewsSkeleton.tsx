import { Skeleton } from "@/components/ui/skeleton";

export function ReviewsSkeleton() {
  return (
    <div className="rounded-[1.75rem] bg-card p-6 ring-1 ring-border/80 sm:p-8 lg:p-10" aria-busy="true" aria-label="Loading reviews">
      <div className="flex items-end justify-between gap-5 border-b border-border/70 pb-7">
        <div className="space-y-3"><Skeleton className="h-4 w-28" /><Skeleton className="h-8 w-36" /></div>
        <div className="flex items-center gap-3"><Skeleton className="size-11 rounded-xl" /><div className="space-y-2"><Skeleton className="h-5 w-16" /><Skeleton className="h-3 w-20" /></div></div>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-3">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="space-y-3 rounded-2xl bg-background p-5 ring-1 ring-border/70">
            <div className="flex justify-between gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}
