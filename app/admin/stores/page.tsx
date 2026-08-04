import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { StoreStatusActions } from "@/components/admin/StoreStatusActions";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function AdminStoresPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const stores = await prisma.store.findMany({
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Store Management</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review seller applications and manage store availability.
        </p>
      </div>

      {stores.length === 0 ? (
        <EmptyState
          icon={<Store className="size-6" aria-hidden="true" />}
          title="No store applications"
          description="Seller applications will appear here for review."
        />
      ) : (
        <div className="space-y-4">
          {stores.map((store) => (
            <Card key={store.id}>
              <CardHeader className="flex flex-col gap-3 border-b sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="break-words">{store.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{store.owner.name ?? "Unnamed user"} · {store.owner.email}</p>
                </div>
                <Badge variant={store.status === "APPROVED" ? "default" : "secondary"}>
                  {store.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 py-5">
                <p className="text-sm text-muted-foreground">Applied {formatDate(store.createdAt)}</p>
                {store.description && <p>{store.description}</p>}
                <StoreStatusActions storeId={store.id} status={store.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
