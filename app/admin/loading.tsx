import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-12" aria-busy="true" aria-label="Loading admin dashboard">
      <div className="mb-8 space-y-3"><Skeleton className="h-9 w-64 max-w-full" /><Skeleton className="h-4 w-96 max-w-full" /></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <Card key={index}><CardHeader className="space-y-3"><Skeleton className="h-4 w-28" /><Skeleton className="h-9 w-20" /></CardHeader></Card>)}</div>
      <div className="mt-6 space-y-4 rounded-xl border bg-card p-6 shadow-sm"><Skeleton className="h-6 w-44" />{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-12 w-full" />)}</div>
      <span className="sr-only" role="status">Loading administration content…</span>
    </main>
  );
}
