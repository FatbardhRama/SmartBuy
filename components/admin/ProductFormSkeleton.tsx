import { Skeleton } from "@/components/ui/skeleton";

export function ProductFormSkeleton() {
  return (
    <main className="mx-auto max-w-xl px-6 py-10" aria-busy="true" aria-label="Loading product form">
      <Skeleton className="mb-8 h-9 w-48" />
      <div className="space-y-5">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-36" />
      </div>
    </main>
  );
}
