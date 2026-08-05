import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WishlistProducts } from "@/components/wishlist/WishlistProducts";
import { Heart, Sparkles } from "lucide-react";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: {
      userId: session.user.id,
    },

    include: {
      product: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 sm:pb-24 sm:pt-12">
      <div className="mb-10 flex flex-col gap-5 border-b border-border pb-9 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="size-4" aria-hidden="true" /> Your saved collection</p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">My wishlist</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">Keep your favorite products close and move them to your cart when the time is right.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-primary/[0.06] px-5 py-4 ring-1 ring-primary/10"><Heart className="size-5 fill-primary/15 text-primary" aria-hidden="true" /><p><span className="font-bold text-foreground">{wishlistItems.length}</span> <span className="text-sm text-muted-foreground">{wishlistItems.length === 1 ? "saved item" : "saved items"}</span></p></div>
      </div>

      <WishlistProducts
        initialProducts={wishlistItems.map((item) => item.product)}
      />
    </main>
  );
}
