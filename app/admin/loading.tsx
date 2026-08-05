import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 sm:pt-12" aria-busy="true" aria-label="Loading admin dashboard">
      <div className="mb-10 space-y-3"><Skeleton className="h-4 w-28" /><Skeleton className="h-12 w-72 max-w-full" /><Skeleton className="h-4 w-96 max-w-full" /></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Card key={index} className="rounded-2xl border-0 ring-1 ring-border/80"><CardHeader className="space-y-5"><Skeleton className="size-10 rounded-xl" /><div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-9 w-28" /></div></CardHeader></Card>)}</div>
      <div className="mt-10 space-y-5"><Skeleton className="h-8 w-52" /><Skeleton className="h-96 w-full rounded-2xl" /></div>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">{Array.from({ length: 2 }, (_, section) => <div key={section} className="space-y-5"><Skeleton className="h-8 w-44" /><div className="space-y-3 rounded-2xl bg-card p-4 ring-1 ring-border/80">{Array.from({ length: 4 }, (_, row) => <Skeleton key={row} className="h-14 w-full rounded-xl" />)}</div></div>)}</div>
      <span className="sr-only" role="status">Loading administration content...</span>
    </main>
  );
}
