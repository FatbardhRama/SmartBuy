import { Skeleton } from "@/components/ui/skeleton";

export function ProductFormSkeleton() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-20 pt-10 sm:pt-12" aria-busy="true" aria-label="Loading product form">
      <Skeleton className="mb-6 h-4 w-32" />
      <div className="mb-8 space-y-3"><Skeleton className="h-10 w-52" /><Skeleton className="h-4 w-80 max-w-full" /></div>
      <div className="space-y-6 rounded-2xl bg-card p-6 ring-1 ring-border/80">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <div className="grid gap-5 sm:grid-cols-2"><Skeleton className="h-11 w-full rounded-xl" /><Skeleton className="h-11 w-full rounded-xl" /></div>
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <div className="flex justify-end border-t border-border/70 pt-6"><Skeleton className="h-11 w-36 rounded-xl" /></div>
      </div>
    </main>
  );
}
