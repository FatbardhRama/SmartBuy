import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserStore() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { session: null, store: null };
  }

  const store = await prisma.store.findUnique({
    where: { ownerId: session.user.id },
  });

  return { session, store };
}

export async function getApprovedSellerStore() {
  const { session, store } = await getCurrentUserStore();

  if (!session) {
    return { error: "UNAUTHENTICATED" as const, store: null };
  }

  if (!store) {
    return { error: "NO_STORE" as const, store: null };
  }

  if (store.status !== "APPROVED") {
    return { error: "STORE_NOT_APPROVED" as const, store: null };
  }

  return { error: null, store };
}
