import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { stripeEnvironment } from "@/lib/stripe-env";
import { isValidId } from "@/lib/validation";

type DraftItem = {
  productId: string;
  storeId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
};

class FulfillmentError extends Error {}

export const runtime = "nodejs";

function parseDraftItems(value: Prisma.JsonValue): DraftItem[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;

  const items: DraftItem[] = [];
  const productIds = new Set<string>();

  for (const valueItem of value) {
    if (typeof valueItem !== "object" || valueItem === null || Array.isArray(valueItem)) {
      return null;
    }

    const item = valueItem as Prisma.JsonObject;
    if (
      typeof item.productId !== "string" ||
      !isValidId(item.productId) ||
      typeof item.storeId !== "string" ||
      !isValidId(item.storeId) ||
      typeof item.productName !== "string" ||
      item.productName.length === 0 ||
      typeof item.productImage !== "string" ||
      typeof item.price !== "number" ||
      !Number.isFinite(item.price) ||
      item.price <= 0 ||
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      productIds.has(item.productId)
    ) {
      return null;
    }

    productIds.add(item.productId);
    items.push({
      productId: item.productId,
      storeId: item.storeId,
      productName: item.productName,
      productImage: item.productImage,
      price: item.price,
      quantity: item.quantity,
    });
  }

  return items;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ message: "Missing Stripe signature." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      stripeEnvironment.webhookSecret
    );
  } catch {
    return NextResponse.json({ message: "Invalid Stripe signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  try {
    const eventSession = event.data.object;
    const checkoutSession = await stripe.checkout.sessions.retrieve(eventSession.id);

    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json({ received: true, processed: false });
    }

    const draftId = checkoutSession.metadata?.checkoutDraftId;
    const metadataUserId = checkoutSession.metadata?.userId;
    if (!draftId || !metadataUserId || !isValidId(draftId) || !isValidId(metadataUserId)) {
      throw new FulfillmentError("Checkout Session metadata is incomplete.");
    }

    const draft = await prisma.checkoutDraft.findFirst({
      where: { id: draftId, stripeSessionId: checkoutSession.id },
      select: {
        id: true,
        userId: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        items: true,
        processedAt: true,
      },
    });

    if (!draft) {
      throw new FulfillmentError("Checkout draft was not found.");
    }

    if (
      draft.userId !== metadataUserId ||
      checkoutSession.client_reference_id !== draft.userId
    ) {
      throw new FulfillmentError("Checkout customer does not match the draft.");
    }

    if (draft.processedAt) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    const items = parseDraftItems(draft.items);
    if (!items) {
      throw new FulfillmentError("Checkout draft items are invalid.");
    }

    const expectedAmount = items.reduce(
      (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
      0
    );
    if (
      checkoutSession.currency !== "eur" ||
      checkoutSession.amount_total !== expectedAmount
    ) {
      throw new FulfillmentError("Paid amount does not match the checkout draft.");
    }

    const paymentIntentId =
      typeof checkoutSession.payment_intent === "string"
        ? checkoutSession.payment_intent
        : checkoutSession.payment_intent?.id;
    if (!paymentIntentId) {
      throw new FulfillmentError("Paid Checkout Session has no PaymentIntent.");
    }

    const paidAt = new Date(event.created * 1000);

    const result = await prisma.$transaction(
      async (tx) => {
        const claim = await tx.checkoutDraft.updateMany({
          where: { id: draft.id, processedAt: null },
          data: { processedAt: paidAt },
        });

        if (claim.count !== 1) {
          return "duplicate" as const;
        }

        const products = await tx.product.findMany({
          where: { id: { in: items.map((item) => item.productId) } },
          select: { id: true, storeId: true, stock: true },
        });

        if (products.length !== items.length) {
          throw new FulfillmentError("One or more paid products no longer exist.");
        }

        const productsById = new Map(products.map((product) => [product.id, product]));

        for (const item of items) {
          const product = productsById.get(item.productId);
          if (!product || product.storeId !== item.storeId) {
            throw new FulfillmentError("A paid product changed Stores.");
          }

          const updated = await tx.product.updateMany({
            where: {
              id: item.productId,
              storeId: item.storeId,
              stock: { gte: item.quantity },
            },
            data: { stock: { decrement: item.quantity } },
          });

          if (updated.count !== 1) {
            throw new FulfillmentError(`Insufficient stock for ${item.productName}.`);
          }
        }

        const groups = new Map<string, DraftItem[]>();
        for (const item of items) {
          const group = groups.get(item.storeId) ?? [];
          group.push(item);
          groups.set(item.storeId, group);
        }

        for (const [storeId, group] of groups) {
          await tx.order.create({
            data: {
              userId: draft.userId,
              storeId,
              fullName: draft.fullName,
              email: draft.email,
              phone: draft.phone,
              address: draft.address,
              city: draft.city,
              postalCode: draft.postalCode,
              total: group.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              ),
              paymentStatus: "PAID",
              checkoutSessionId: checkoutSession.id,
              paymentIntentId,
              paidAt,
              items: {
                create: group.map((item) => ({
                  productId: item.productId,
                  productName: item.productName,
                  productImage: item.productImage,
                  quantity: item.quantity,
                  price: item.price,
                })),
              },
            },
          });
        }

        return "processed" as const;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    return NextResponse.json({
      received: true,
      duplicate: result === "duplicate",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002" || error.code === "P2034") {
        const sessionId = event.data.object.id;
        const processed = await prisma.checkoutDraft.findFirst({
          where: { stripeSessionId: sessionId, processedAt: { not: null } },
          select: { id: true },
        });

        if (processed) {
          return NextResponse.json({ received: true, duplicate: true });
        }
      }
    }

    return NextResponse.json(
      { message: "Stripe payment fulfillment failed." },
      { status: 500 }
    );
  }
}
