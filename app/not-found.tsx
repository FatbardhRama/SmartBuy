import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center px-6 py-16">
      <EmptyState
        icon={<SearchX className="size-6" aria-hidden="true" />}
        title="Page not found"
        description="The page you requested could not be found. Browse our products or head back to the home page."
        action={
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        }
        className="w-full max-w-xl"
      />
    </main>
  );
}
