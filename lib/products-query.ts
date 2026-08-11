import "server-only";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { isValidId } from "@/lib/validation";

export type ProductListItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  store: { name: string; slug: string } | null;
};

export type ProductsQueryInput = {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
  ids?: string[];
  idsRequested?: boolean;
};

export type ProductsQueryResult = {
  products: ProductListItem[];
  total: number;
  page: number;
  totalPages: number;
};

export async function getApprovedProducts({
  search = "",
  category = "",
  sort = "newest",
  page = 1,
  limit = 12,
  ids = [],
  idsRequested = false,
}: ProductsQueryInput): Promise<ProductsQueryResult> {
  const normalizedSearch = search.trim();
  const normalizedCategory = category.trim();
  const normalizedPage = Number.isInteger(page) && page > 0 ? page : 1;
  const normalizedLimit = Number.isInteger(limit) && limit > 0 ? limit : 12;
  const productIds = ids.filter((id) => isValidId(id)).slice(0, 20);

  const orderBy: Prisma.ProductOrderByWithRelationInput = {};

  switch (sort) {
    case "price-low":
      orderBy.price = "asc";
      break;
    case "price-high":
      orderBy.price = "desc";
      break;
    case "name-a":
      orderBy.name = "asc";
      break;
    case "name-z":
      orderBy.name = "desc";
      break;
    default:
      orderBy.createdAt = "desc";
  }

  const where: Prisma.ProductWhereInput = {
    AND: [
      {
        store: {
          is: {
            status: "APPROVED",
          },
        },
      },
      idsRequested
        ? {
            id: {
              in: productIds,
            },
          }
        : {},
      normalizedSearch
        ? {
            OR: [
              {
                name: {
                  contains: normalizedSearch,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: normalizedSearch,
                  mode: "insensitive",
                },
              },
              {
                category: {
                  contains: normalizedSearch,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {},
      normalizedCategory && normalizedCategory !== "All"
        ? {
            category: {
              equals: normalizedCategory,
              mode: "insensitive",
            },
          }
        : {},
    ],
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (normalizedPage - 1) * normalizedLimit,
      take: normalizedLimit,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        category: true,
        stock: true,
        store: {
          select: {
            name: true,
            slug: true,
            status: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((product) => ({
      ...product,
      store:
        product.store?.status === "APPROVED"
          ? { name: product.store.name, slug: product.store.slug }
          : null,
    })),
    total,
    page: normalizedPage,
    totalPages: Math.ceil(total / normalizedLimit),
  };
}
