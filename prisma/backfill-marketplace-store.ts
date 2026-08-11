import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!admin) {
    throw new Error(
      "Backfill requires an existing ADMIN user to own the SmartBuy Official store."
    );
  }

  const { officialStore, updatedProducts } = await prisma.$transaction(async (tx) => {
    const officialStore = await tx.store.upsert({
      where: {
        slug: "smartbuy-official",
      },
      update: {
        status: "APPROVED",
      },
      create: {
        ownerId: admin.id,
        name: "SmartBuy Official",
        slug: "smartbuy-official",
        description: "Official products sold by SmartBuy.",
        status: "APPROVED",
      },
    });

    const updatedProducts = await tx.product.updateMany({
      where: {
        storeId: null,
      },
      data: {
        storeId: officialStore.id,
      },
    });

    return { officialStore, updatedProducts };
  });

  console.log(
    `SmartBuy Official store is ready (${officialStore.id}). Assigned ${updatedProducts.count} existing product(s).`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
