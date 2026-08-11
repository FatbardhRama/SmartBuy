import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 sm:pb-24 sm:pt-12" aria-busy="true" aria-label="Loading page">
      <div className="mb-9 space-y-3 border-b border-border pb-8"><Skeleton className="h-4 w-28" /><Skeleton className="h-11 w-72 max-w-full" /><Skeleton className="h-5 w-full max-w-xl" /></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="space-y-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border"><Skeleton className="aspect-[16/9] w-full rounded-xl" /><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>)}</div>
      <span className="sr-only" role="status">Loading page content...</span>
    </main>
  );
}
