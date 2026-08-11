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
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <Card className="border-0 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.55)] ring-1 ring-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10"><AlertCircle className="size-5 text-destructive" aria-hidden="true" /></span>
            <div>
              <CardTitle>Unable to load seller content</CardTitle>
              <CardDescription className="mt-1">Something went wrong while loading this page.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button className="rounded-xl" onClick={() => unstable_retry()}>Try again</Button>
          <Link href="/seller" className={buttonVariants({ variant: "outline", className: "rounded-xl" })}>Seller dashboard</Link>
        </CardContent>
      </Card>
    </main>
  );
}
