import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthFormSkeleton() {
  return (
    <Card className="w-full max-w-md" aria-busy="true" aria-label="Loading form">
      <CardHeader className="items-center">
        <Skeleton className="h-8 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="mx-auto h-4 w-24" />
      </CardContent>
    </Card>
  );
}
