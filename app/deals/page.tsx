import { Card, CardContent } from "@/components/ui/card";

export default function DealsPage() {
  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 sm:py-10">

      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">
        Deals
      </h1>

      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Special deals and discounts will appear here soon.
          </p>
        </CardContent>
      </Card>

    </main>
  );
}
