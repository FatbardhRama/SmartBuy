import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Placeholder({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className}`} />;
}

export default function SellerLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 sm:pb-24 sm:pt-12" aria-busy="true" aria-label="Loading seller dashboard">
      <div className="mb-9 space-y-3 border-b border-border pb-8"><Placeholder className="h-4 w-32" /><Placeholder className="h-11 w-64 max-w-full" /><Placeholder className="h-5 w-96 max-w-full" /></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => <Card key={index} className="border-0 shadow-sm ring-1 ring-border"><CardHeader className="space-y-3"><Placeholder className="h-4 w-28" /><Placeholder className="h-8 w-20" /></CardHeader></Card>)}
      </div>
      <Card className="mt-6 border-0 shadow-sm ring-1 ring-border"><CardHeader><Placeholder className="h-6 w-40" /></CardHeader><CardContent className="space-y-4">{Array.from({ length: 4 }, (_, index) => <Placeholder key={index} className="h-12 w-full" />)}</CardContent></Card>
      <span className="sr-only" role="status">Loading seller content...</span>
    </main>
  );
}
