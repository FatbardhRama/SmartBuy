import { Card, CardContent } from "@/components/ui/card";

export default function DealsPage() {
  return (
    <main className="container mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-6">
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