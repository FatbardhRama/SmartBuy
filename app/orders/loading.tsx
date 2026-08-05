import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10 sm:pt-12" aria-busy="true" aria-label="Loading orders">
      <div className="mb-10 space-y-3"><Skeleton className="h-4 w-28" /><Skeleton className="h-12 w-56" /><Skeleton className="h-4 w-80 max-w-full" /></div>
      <div className="space-y-5">{Array.from({ length: 3 }, (_, index) => <Card key={index} className="rounded-2xl border-0 ring-1 ring-border/80"><CardHeader className="flex flex-row justify-between gap-4 border-b border-border/70"><div className="space-y-3"><Skeleton className="h-4 w-24" /><Skeleton className="h-6 w-64 max-w-full" /><Skeleton className="h-4 w-44" /></div><div className="space-y-3"><Skeleton className="h-6 w-20" /><Skeleton className="h-6 w-24" /></div></CardHeader><CardContent className="space-y-3"><Skeleton className="h-12 w-full rounded-xl" /><Skeleton className="h-12 w-full rounded-xl" /><Skeleton className="ml-auto h-10 w-32 rounded-xl" /></CardContent></Card>)}</div>
      <span className="sr-only" role="status">Loading your orders...</span>
    </main>
  );
}
