import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatCurrency";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { AlertTriangle, ArrowRight, DollarSign, Package, ShoppingBag, Store, TrendingUp, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BestSellerGroup = {
  productId: string | null;
  _sum: {
    quantity: number | null;
  };
};

type BestSellerProduct = {
  id: string;
  name: string;
  image: string;
};

type PendingStore = {
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

type LowStockProduct = {
  id: string;
  name: string;
  image: string;
  stock: number;
};

type RecentOrder = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  total: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  checkoutSessionId: string | null;
  paymentIntentId: string | null;
  paidAt: Date | null;
  createdAt: Date;
  userId: string | null;
  storeId: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    productName: string;
    productImage: string;
    orderId: string;
    productId: string | null;
    product: {
      id: string;
      name: string;
      description: string;
      price: number;
      image: string;
      category: string;
      stock: number;
      createdAt: Date;
      storeId: string | null;
    } | null;
  }>;
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.count();

  const products = await prisma.product.count();

  const lowStockProductResults = await prisma.product.findMany({
    where: {
      stock: {
        lte: 5,
      },
    },
    orderBy: {
      stock: "asc",
    },
    select: {
      id: true,
      name: true,
      image: true,
      stock: true,
    },
  });

  const orders = await prisma.order.count();

  const pendingStoreResults = await prisma.store.findMany({
    where: {
      status: "PENDING",
    },
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
    take: 5,
  });

  const pendingStores: PendingStore[] = pendingStoreResults;

  const revenue = await prisma.order.aggregate({
    where: {
      status: {
        not: "CANCELLED",
      },
    },
    _sum: {
      total: true,
    },
  });

  const revenueOrders = await prisma.order.findMany({
    where: {
      status: {
        not: "CANCELLED",
      },
    },
    select: {
      total: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const revenueByMonth = new Map<string, {
    month: string;
    revenue: number;
  }>();

  for (const order of revenueOrders) {
    const year = order.createdAt.getUTCFullYear();
    const month = order.createdAt.getUTCMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
    const monthLabel = new Intl.DateTimeFormat("en-GB", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month)));
    const existingRevenue = revenueByMonth.get(monthKey);

    revenueByMonth.set(monthKey, {
      month: monthLabel,
      revenue: (existingRevenue?.revenue ?? 0) + order.total,
    });
  }

  const monthlyRevenue = Array.from(revenueByMonth.values());

  const bestSellerGroupResults = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: {
        status: {
          not: "CANCELLED",
        },
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  const bestSellerGroups: BestSellerGroup[] = bestSellerGroupResults;

  const bestSellerProductIds = bestSellerGroups
    .map((group) => group.productId)
    .filter((productId): productId is string => productId !== null);

  const bestSellerProductResults = await prisma.product.findMany({
    where: {
      id: {
        in: bestSellerProductIds,
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  const lowStockProducts: LowStockProduct[] = lowStockProductResults;

  const bestSellerProducts: BestSellerProduct[] = bestSellerProductResults;

  const productsById = new Map(
    bestSellerProducts.map((product) => [product.id, product])
  );

  const bestSellers = bestSellerGroups.flatMap((group) => {
    if (!group.productId) {
      return [];
    }

    const product = productsById.get(group.productId);

    if (!product) {
      return [];
    }

    return [{
      ...product,
      quantitySold: group._sum.quantity ?? 0,
    }];
  });

  const recentOrderResults = await prisma.order.findMany({
    take: 5,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const recentOrders: RecentOrder[] = recentOrderResults;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 sm:pb-24 sm:pt-12">
      <section className="relative mb-8 overflow-hidden rounded-[2rem] bg-[linear-gradient(118deg,#FFFFFF_0%,#F1F7FF_56%,#ECFEFF_100%)] px-6 py-8 shadow-[0_24px_64px_-46px_rgba(37,99,235,0.42)] ring-1 ring-border/80 sm:mb-10 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div><p className="sb-eyebrow">Administration</p><h1 className="sb-heading-xl">Dashboard overview</h1><p className="mt-3 text-muted-foreground">Monitor marketplace activity, sales performance, and inventory health.</p></div>
        <div className="flex flex-col gap-2 sm:flex-row"><Link href="/admin/stores" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>Review stores</Link><Link href="/admin/products" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>Manage products</Link><Link href="/admin/orders" className={cn(buttonVariants(), "gap-2 rounded-xl")}>Manage orders <ArrowRight className="size-4" /></Link></div>
        </div>
      </section>

      <div className="mb-10 grid grid-cols-1 gap-4 motion-safe:animate-in motion-safe:fade-in-0 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Users", value: users.toLocaleString(), icon: Users, tone: "text-primary bg-primary/10" },
          { label: "Products", value: products.toLocaleString(), icon: Package, tone: "text-cyan-700 bg-accent/10 dark:text-cyan-300" },
          { label: "Orders", value: orders.toLocaleString(), icon: ShoppingBag, tone: "text-amber-700 bg-warning/10 dark:text-amber-300" },
          { label: "Pending stores", value: pendingStores.length.toLocaleString(), icon: Store, tone: "text-cyan-700 bg-accent/10 dark:text-cyan-300" },
          { label: "Revenue", value: formatCurrency(revenue._sum.total ?? 0), icon: DollarSign, tone: "text-green-700 bg-success/10 dark:text-green-300" },
        ].map((metric) => { const Icon = metric.icon; const isRevenue = metric.label === "Revenue"; return <div key={metric.label} className={cn("rounded-[1.35rem] p-5 sb-surface sb-surface-hover", isRevenue && "border-0 bg-[#0f172a] text-white ring-slate-800 shadow-[0_20px_48px_-32px_rgba(15,23,42,0.72)] hover:border-slate-700")}><div className="flex items-center justify-between gap-4"><span className={`flex size-10 items-center justify-center rounded-xl ${isRevenue ? "bg-white/10 text-cyan-300" : metric.tone}`}><Icon className="size-5" /></span><TrendingUp className={cn("size-4 text-muted-foreground", isRevenue && "text-slate-500")} /></div><p className={cn("mt-6 text-sm text-muted-foreground", isRevenue && "text-slate-400")}>{metric.label}</p><p className="mt-1 text-3xl font-bold tracking-[-0.035em] tabular-nums">{metric.value}</p></div>; })}
      </div>

      <section className="mb-12 motion-safe:animate-in motion-safe:fade-in-0">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Marketplace review</p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">Pending store applications</h2>
          </div>
          <Link href="/admin/stores" className="text-sm font-semibold text-primary hover:underline">View all</Link>
        </div>
        {pendingStores.length === 0 ? (
          <AdminEmpty message="No pending store applications found." />
        ) : (
          <div className="overflow-hidden rounded-[1.5rem] sb-surface">
            {pendingStores.map((store) => (
              <div key={store.id} className="grid gap-3 border-b border-border/70 p-4 last:border-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{store.name}</h3>
                  <p className="text-sm text-muted-foreground">{store.owner.name ?? "Unnamed user"} - {store.owner.email}</p>
                </div>
                <Link href="/admin/stores" className={cn(buttonVariants({ size: "sm", variant: "outline" }), "rounded-lg")}>Review</Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-12 motion-safe:animate-in motion-safe:fade-in-0"><div className="mb-6"><p className="text-sm font-semibold text-primary">Performance</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">Revenue analytics</h2></div><RevenueChart data={monthlyRevenue} /></section>

      <div className="mb-12 grid gap-8 lg:grid-cols-2">
        <section><div className="mb-5"><p className="text-sm font-semibold text-primary">Sales</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">Best sellers</h2></div>{bestSellers.length === 0 ? <AdminEmpty message="No product sales found." /> : <div className="overflow-hidden rounded-[1.5rem] bg-card ring-1 ring-border/80">{bestSellers.map((product, index) => <div key={product.id} className="flex items-center gap-4 border-b border-border/70 p-4 last:border-0"><span className="w-5 text-sm font-bold text-muted-foreground">{index + 1}</span>{product.image && <Image src={product.image} alt={product.name} width={48} height={48} className="size-12 rounded-xl object-cover" />}<div className="min-w-0 flex-1"><h3 className="truncate font-semibold">{product.name}</h3><p className="text-sm text-muted-foreground">{product.quantitySold} sold</p></div></div>)}</div>}</section>
        <section><div className="mb-5"><p className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300"><AlertTriangle className="size-4" /> Inventory attention</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">Low-stock products</h2></div>{lowStockProducts.length === 0 ? <AdminEmpty message="No low-stock products found." /> : <div className="overflow-hidden rounded-[1.5rem] bg-card ring-1 ring-border/80">{lowStockProducts.map((product) => <div key={product.id} className="flex items-center gap-4 border-b border-border/70 p-4 last:border-0">{product.image && <Image src={product.image} alt={product.name} width={48} height={48} className="size-12 rounded-xl object-cover" />}<div className="min-w-0 flex-1"><h3 className="truncate font-semibold">{product.name}</h3><p className="text-sm text-muted-foreground">Inventory requires review</p></div><span className="rounded-lg bg-warning/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">{product.stock} left</span></div>)}</div>}</section>
      </div>

      <section><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-primary">Latest activity</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.03em]">Recent orders</h2></div><Link href="/admin/orders" className="text-sm font-semibold text-primary hover:underline">View all</Link></div>{recentOrders.length === 0 ? <AdminEmpty message="No orders found." /> : <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-border/80">{recentOrders.map((order) => <div key={order.id} className="grid gap-3 border-b border-border/70 p-4 last:border-0 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:p-5"><div className="min-w-0"><h3 className="truncate font-semibold">Order #{order.id}</h3><p className="text-sm text-muted-foreground">{order.fullName} · {new Date(order.createdAt).toLocaleDateString()}</p></div><span className="w-fit rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold capitalize">{order.status.toLowerCase()}</span><div className="sm:text-right"><p className="font-bold tabular-nums">{formatCurrency(order.total)}</p><p className="text-xs text-muted-foreground">{order.items.length} {order.items.length === 1 ? "item" : "items"}</p></div></div>)}</div>}</section>
    </main>
  );
}

function AdminEmpty({ message }: { message: string }) {
  return <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">{message}</div>;
}
