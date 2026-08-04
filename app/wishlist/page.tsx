import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WishlistProducts } from "@/components/wishlist/WishlistProducts";

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
    <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          My Wishlist
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Save products you want to revisit later.
        </p>
      </div>

      <WishlistProducts
        initialProducts={wishlistItems.map((item) => item.product)}
      />
    </main>
  );
}
