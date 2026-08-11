import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CalendarDays, Mail, Store, UserRound } from "lucide-react";

import { StoreStatusActions } from "@/components/admin/StoreStatusActions";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type AdminStore = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  createdAt: Date;
  updatedAt: Date;
  owner: {
    name: string | null;
    email: string;
  };
};

const storeBadgeVariant = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  SUSPENDED: "destructive",
} as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default async function AdminStoresPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const storeResults = await prisma.store.findMany({
    include: { owner: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const stores: AdminStore[] = storeResults;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-12">
      <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(118deg,#FFFFFF_0%,#F1F7FF_56%,#ECFEFF_100%)] px-6 py-8 shadow-[0_24px_64px_-46px_rgba(37,99,235,0.42)] ring-1 ring-border/80 sm:mb-10 sm:px-9 sm:py-10"><div className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full bg-primary/10 blur-2xl" /><div className="relative"><p className="sb-eyebrow">Marketplace administration</p><h1 className="sb-heading-xl">Store management</h1><p className="mt-3 sb-muted-copy">Review seller applications and manage store availability.</p></div></section>

      {stores.length === 0 ? (
        <EmptyState icon={<Store className="size-6" aria-hidden="true" />} title="No store applications" description="Seller applications will appear here for review." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {stores.map((store) => (
            <Card key={store.id} className="overflow-hidden rounded-[1.5rem] border-0 sb-surface sb-surface-hover">
              <CardHeader className="flex flex-col gap-4 border-b border-border/70 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Store className="size-5" /></span><div className="min-w-0"><CardTitle className="break-words text-lg">{store.name}</CardTitle><p className="mt-1 truncate text-sm text-muted-foreground">Seller application</p></div></div>
                <Badge variant={storeBadgeVariant[store.status]} className="rounded-lg">{store.status.charAt(0) + store.status.slice(1).toLowerCase()}</Badge>
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
