"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[50vh] items-center justify-center px-6 py-16">
      <EmptyState
        icon={<TriangleAlert className="size-6" aria-hidden="true" />}
        title="Something went wrong"
        description="We could not load this page. Please try again, or return home and continue shopping."
        action={
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={reset}>Try Again</Button>
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          </div>
        }
        className="w-full max-w-xl"
      />
    </main>
  );
}
