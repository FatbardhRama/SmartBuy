import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-12" aria-busy="true" aria-label="Loading orders">
      <div className="mb-8 space-y-3"><Skeleton className="h-9 w-48" /><Skeleton className="h-4 w-80 max-w-full" /></div>
      <div className="space-y-5">{Array.from({ length: 3 }, (_, index) => <Card key={index}><CardHeader className="flex flex-row justify-between gap-4 border-b"><div className="space-y-3"><Skeleton className="h-5 w-56" /><Skeleton className="h-4 w-32" /></div><Skeleton className="h-6 w-24" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></CardContent></Card>)}</div>
      <span className="sr-only" role="status">Loading your orders…</span>
    </main>
  );
}
