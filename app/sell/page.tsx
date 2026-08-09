import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, ShieldCheck, Store } from "lucide-react";

import { SellerApplicationForm } from "@/components/seller/SellerApplicationForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
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
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-12">
      <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(118deg,#FFFFFF_0%,#F1F7FF_56%,#ECFEFF_100%)] px-6 py-8 shadow-[0_24px_64px_-46px_rgba(37,99,235,0.42)] ring-1 ring-border/80 sm:mb-10 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)] lg:items-end">
        <div className="max-w-2xl"><p className="flex items-center gap-2 text-sm font-semibold text-primary"><Store className="size-4" aria-hidden="true" /> SmartBuy marketplace</p><h1 className="sb-heading-xl">Build your store with us.</h1><p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">Apply to sell electronics through a trusted marketplace designed for clear product management and confident customer experiences.</p></div>
        <div className="grid gap-3 rounded-2xl bg-slate-950 p-5 text-sm text-slate-200 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.9)]"><p className="flex items-center gap-2"><ShieldCheck className="size-4 text-cyan-300" aria-hidden="true" /> Reviewed seller applications</p><p className="flex items-center gap-2"><BadgeCheck className="size-4 text-cyan-300" aria-hidden="true" /> Dedicated seller workspace</p></div>
      </div>
      </section>

      {store ? (
        <Card className="max-w-3xl overflow-hidden rounded-[1.5rem] border-0 ring-1 ring-border shadow-[0_20px_52px_-42px_rgba(15,23,42,0.38)]">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{store.name}</CardTitle>
                <CardDescription className="mt-1">smartbuy.com/stores/{store.slug}</CardDescription>
              </div>
              <Badge variant={store.status === "APPROVED" ? "default" : "secondary"} className="rounded-full px-3 py-1">
                {store.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="leading-7">{store.description}</p>
            <div className="flex gap-3 rounded-xl bg-muted/60 p-4"><Clock3 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><p className="text-sm leading-6 text-muted-foreground">
              {statusDescription[store.status]}
            </p></div>
            {store.status === "APPROVED" && <Link href="/seller" className={buttonVariants({ className: "rounded-xl" })}>Open seller dashboard <ArrowRight className="size-4" aria-hidden="true" /></Link>}
          </CardContent>
        </Card>
      ) : (
        <SellerApplicationForm />
      )}
    </main>
  );
}
