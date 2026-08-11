import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthFormSkeleton() {
  return (
    <Card className="mx-6 w-full max-w-md rounded-[1.75rem] border-0 ring-1 ring-border/80" aria-busy="true" aria-label="Loading form">
      <CardHeader className="items-center">
        <Skeleton className="size-12 rounded-2xl" />
        <Skeleton className="mt-2 h-8 w-56 max-w-full" />
        <Skeleton className="mt-2 h-4 w-72 max-w-full" />
      </CardHeader>
      <CardContent className="space-y-5">
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="mx-auto h-4 w-24" />
      </CardContent>
    </Card>
  );
}
