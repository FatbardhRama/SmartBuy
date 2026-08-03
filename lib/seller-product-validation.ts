import { Prisma } from "@prisma/client";

import {
  isNonEmptyString,
  isValidNonNegativeInteger,
  isValidPositiveNumber,
} from "@/lib/validation";

export async function readJsonObject(request: Request) {
  try {
    const body: unknown = await request.json();
    return typeof body === "object" && body !== null && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function validateSellerProductBody(
  body: Record<string, unknown>,
  partial = false
): { data: Prisma.ProductUncheckedCreateInput | Prisma.ProductUpdateManyMutationInput } | { message: string } {
  const allowedFields = ["name", "description", "price", "category", "image", "stock"] as const;

  if (partial && !allowedFields.some((field) => body[field] !== undefined)) {
    return { message: "No product updates supplied." };
  }

  const stringFields = ["name", "description", "category", "image"] as const;
  for (const field of stringFields) {
    if ((!partial || body[field] !== undefined) && !isNonEmptyString(body[field])) {
      return { message: `${field[0].toUpperCase()}${field.slice(1)} is required.` };
    }
  }

  if ((!partial || body.price !== undefined) && !isValidPositiveNumber(body.price)) {
    return { message: "Price must be a positive number." };
  }

  if ((!partial || body.stock !== undefined) && !isValidNonNegativeInteger(body.stock)) {
    return { message: "Stock must be a non-negative whole number." };
  }

  const data: Prisma.ProductUpdateManyMutationInput = {};
  for (const field of stringFields) {
    const value = body[field];
    if (isNonEmptyString(value)) data[field] = value.trim();
  }
  if (body.price !== undefined) data.price = Number(body.price);
  if (body.stock !== undefined) data.stock = Number(body.stock);

  return { data };
}
