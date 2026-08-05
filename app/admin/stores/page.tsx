import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CalendarDays, Mail, Store, UserRound } from "lucide-react";

import { StoreStatusActions } from "@/components/admin/StoreStatusActions";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default async function AdminStoresPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const stores = await prisma.store.findMany({
    include: { owner: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 sm:pb-24 sm:pt-12">
      <div className="mb-10 max-w-2xl"><p className="text-sm font-semibold text-primary">Marketplace administration</p><h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Store management</h1><p className="mt-3 text-muted-foreground">Review seller applications and manage store availability.</p></div>

      {stores.length === 0 ? (
        <EmptyState icon={<Store className="size-6" aria-hidden="true" />} title="No store applications" description="Seller applications will appear here for review." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {stores.map((store) => (
            <Card key={store.id} className="rounded-2xl border-0 shadow-[0_14px_38px_-28px_rgba(15,23,42,0.4)] ring-1 ring-border/80">
              <CardHeader className="flex flex-col gap-4 border-b border-border/70 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Store className="size-5" /></span><div className="min-w-0"><CardTitle className="break-words text-lg">{store.name}</CardTitle><p className="mt-1 truncate text-sm text-muted-foreground">Seller application</p></div></div>
                <Badge variant={store.status === "APPROVED" ? "default" : store.status === "SUSPENDED" || store.status === "REJECTED" ? "destructive" : "secondary"} className="rounded-lg">{store.status.charAt(0) + store.status.slice(1).toLowerCase()}</Badge>
              </CardHeader>
              <CardContent className="space-y-5 py-1">
                <div className="grid gap-2 text-sm text-muted-foreground"><p className="flex items-center gap-2"><UserRound className="size-4 text-primary" /> {store.owner.name ?? "Unnamed user"}</p><p className="flex items-center gap-2"><Mail className="size-4 text-primary" /> <span className="truncate">{store.owner.email}</span></p><p className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" /> Applied {formatDate(store.createdAt)}</p></div>
                {store.description && <p className="rounded-xl bg-muted/40 p-4 text-sm leading-6">{store.description}</p>}
                <StoreStatusActions storeId={store.id} status={store.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
