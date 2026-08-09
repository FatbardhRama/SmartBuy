import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarDays, ClipboardX, MapPin, Package, Store } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { formatCurrency } from "@/lib/formatCurrency";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

type OrderItem = { id: string; quantity: number; price: number; productName: string; productImage: string };
type Order = { id: string; status: string; createdAt: Date; fullName: string; email: string; phone: string; address: string; city: string; postalCode: string; total: number; store: { name: string; slug: string }; items: OrderItem[] };
type Props = { params: Promise<{ id: string }> };

async function getOrder(id: string, userId: string): Promise<Order | null> {
  return prisma.order.findFirst({ where: { id, userId }, include: { store: true, items: { include: { product: true } } } });
}

export default async function OrderDetailsPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const order = await getOrder(id, session.user.id);

  if (!order) {
    return <main className="mx-auto flex min-h-[55vh] max-w-5xl items-center justify-center px-6 py-12"><EmptyState icon={<ClipboardX className="size-6" />} title="Order not found" description="This order may not exist or may not belong to your account." action={<div className="flex flex-col justify-center gap-3 sm:flex-row"><Link href="/orders"><Button>View my orders</Button></Link><Link href="/products"><Button variant="outline">Browse electronics</Button></Link></div>} className="w-full max-w-xl" /></main>;
  }

  const status = order.status.charAt(0) + order.status.slice(1).toLowerCase();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-12">
      <Link href="/orders" className="mb-6 inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15"><ArrowLeft className="size-4" /> Back to orders</Link>

      <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(118deg,#FFFFFF_0%,#F1F7FF_56%,#ECFEFF_100%)] px-6 py-8 shadow-[0_24px_64px_-46px_rgba(37,99,235,0.42)] ring-1 ring-border/80 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="sb-eyebrow">Purchase details</p><h1 className="sb-heading-xl">Order #{order.id.slice(-8)}</h1><p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="size-4 text-primary" /> Placed {new Date(order.createdAt).toLocaleDateString()}</p></div>
          <Badge variant={order.status === "CANCELLED" ? "destructive" : "default"} className="w-fit rounded-lg px-3 py-1.5">{status}</Badge>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <section className="overflow-hidden rounded-[1.5rem] bg-card ring-1 ring-border/80 shadow-[0_20px_52px_-42px_rgba(15,23,42,0.38)]">
          <div className="flex items-center gap-3 border-b border-border/70 px-5 py-5 sm:px-6"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Package className="size-5" /></span><div><h2 className="font-semibold">Items in this order</h2><p className="text-sm text-muted-foreground">{order.items.length} {order.items.length === 1 ? "product" : "products"}</p></div></div>
          <div className="divide-y divide-border/70">{order.items.map((item) => <div key={item.id} className="flex gap-4 px-5 py-4 sm:px-6"><div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">{item.productImage && <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="64px" />}</div><div className="min-w-0 flex-1"><p className="font-semibold">{item.productName}</p><p className="mt-1 text-sm text-muted-foreground">Qty {item.quantity} · {formatCurrency(item.price)} each</p></div><p className="shrink-0 self-center font-semibold tabular-nums">{formatCurrency(item.price * item.quantity)}</p></div>)}</div>
        </section>

        <aside className="h-fit rounded-[1.5rem] bg-[#0f172a] p-6 text-slate-100 shadow-[0_26px_56px_-34px_rgba(15,23,42,0.8)] ring-1 ring-slate-800 lg:sticky lg:top-24"><p className="text-sm font-medium text-slate-400">Order total</p><p className="mt-2 text-3xl font-bold tracking-[-0.04em] tabular-nums text-white">{formatCurrency(order.total)}</p><p className="mt-4 border-t border-white/10 pt-4 text-sm text-slate-400">Sold by</p><Link href={`/stores/${order.store.slug}`} className="mt-1 inline-flex items-center gap-2 font-semibold text-cyan-200 hover:text-cyan-100 hover:underline"><Store className="size-4" /> {order.store.name}</Link></aside>
      </div>

      <section className="mt-6 rounded-[1.5rem] bg-card p-5 ring-1 ring-border/80 shadow-[0_20px_52px_-42px_rgba(15,23,42,0.38)] sm:p-6"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><MapPin className="size-5" /></span><div><h2 className="font-semibold">Shipping information</h2><p className="text-sm text-muted-foreground">Delivery details provided at checkout</p></div></div><div className="mt-5 grid gap-1 text-sm leading-6 text-muted-foreground sm:grid-cols-2"><div><p className="font-semibold text-foreground">{order.fullName}</p><p>{order.email}</p><p>{order.phone}</p></div><div><p>{order.address}</p><p>{order.city}, {order.postalCode}</p></div></div></section>
    </main>
  );
}
