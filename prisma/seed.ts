import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { products } from "./data/products";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

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
      "Seeding products requires an existing admin account to own the SmartBuy Official store."
    );
  }

  const officialStore = await prisma.store.upsert({
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

  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: products.map((product) => ({
      ...product,
      storeId: officialStore.id,
    })),
  });

  console.log("Products seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
