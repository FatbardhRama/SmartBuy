"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SellerError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5 text-destructive" aria-hidden="true" />
            <div>
              <CardTitle>Unable to load seller content</CardTitle>
              <CardDescription className="mt-1">Something went wrong while loading this page.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => unstable_retry()}>Try again</Button>
          <Link href="/seller" className={buttonVariants({ variant: "outline" })}>Seller Dashboard</Link>
        </CardContent>
      </Card>
    </main>
  );
}
