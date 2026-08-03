import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { SellerApplicationForm } from "@/components/seller/SellerApplicationForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const statusDescription: Record<string, string> = {
  PENDING: "Your application is awaiting admin review.",
  APPROVED: "Your store is approved. You can now manage products from your seller dashboard.",
  REJECTED: "Your application was not approved. You can update your application details through the seller store API.",
  SUSPENDED: "Your store is currently suspended. Please contact support for help.",
};

export default async function SellPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const store = await prisma.store.findUnique({
    where: {
      ownerId: session.user.id,
    },
  });

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold">Sell on SmartBuy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Open a store and start your seller application.
        </p>
      </div>

      {store ? (
        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{store.name}</CardTitle>
                <CardDescription className="mt-1">smartbuy.com/stores/{store.slug}</CardDescription>
              </div>
              <Badge variant={store.status === "APPROVED" ? "default" : "secondary"}>
                {store.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>{store.description}</p>
            <p className="text-sm text-muted-foreground">
              {statusDescription[store.status]}
            </p>
          </CardContent>
        </Card>
      ) : (
        <SellerApplicationForm />
      )}
    </main>
  );
}
