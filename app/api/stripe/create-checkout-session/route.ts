import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { stripeEnvironment } from "@/lib/stripe-env";
import { isNonEmptyString, isValidEmail, isValidId } from "@/lib/validation";

type CheckoutItem = {
  productId: string;
  quantity: number;
};

const MAX_LINE_ITEMS = 100;
const MAX_ITEM_QUANTITY = 99;

export const runtime = "nodejs";

function invalidRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return invalidRequest("Invalid request body.");
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return invalidRequest("Invalid request body.");
    }

    const checkoutData = body as Record<string, unknown>;
    const { fullName, email, phone, address, city, postalCode } = checkoutData;

    if (
      !isNonEmptyString(fullName) ||
      !isNonEmptyString(email) ||
      !isNonEmptyString(phone) ||
      !isNonEmptyString(address) ||
      !isNonEmptyString(city) ||
      !isNonEmptyString(postalCode)
    ) {
      return invalidRequest("Invalid checkout data.");
    }

    if (!isValidEmail(email)) {
      return invalidRequest("Invalid email format.");
    }

    const items = checkoutData.items;
    if (!Array.isArray(items) || items.length === 0) {
      return invalidRequest("At least one cart item is required.");
    }

    if (items.length > MAX_LINE_ITEMS) {
      return invalidRequest(`A maximum of ${MAX_LINE_ITEMS} cart items is allowed.`);
    }

    const quantities = new Map<string, number>();

    for (const item of items) {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        return invalidRequest("Invalid cart item.");
      }

      const candidate = item as Record<string, unknown>;
      if (!isNonEmptyString(candidate.productId) || !isValidId(candidate.productId)) {
        return invalidRequest("Invalid product id.");
      }

      const quantity = Number(candidate.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
        return invalidRequest(
          `Item quantity must be between 1 and ${MAX_ITEM_QUANTITY}.`
        );
      }

      const productId = candidate.productId.trim();
      const combinedQuantity = (quantities.get(productId) ?? 0) + quantity;
      if (combinedQuantity > MAX_ITEM_QUANTITY) {
        return invalidRequest(
          `Combined item quantity must not exceed ${MAX_ITEM_QUANTITY}.`
        );
      }
      quantities.set(productId, combinedQuantity);
    }

    const checkoutItems: CheckoutItem[] = Array.from(
      quantities,
      ([productId, quantity]) => ({ productId, quantity })
    );

    const products = await prisma.product.findMany({
      where: {
        id: { in: checkoutItems.map((item) => item.productId) },
        store: { is: { status: "APPROVED" } },
      },
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
        stock: true,
        storeId: true,
      },
    });

    if (products.length !== checkoutItems.length) {
      return NextResponse.json(
        { message: "One or more products are unavailable." },
        { status: 404 }
      );
    }

    const productsById = new Map(products.map((product) => [product.id, product]));
    const draftItems: Array<{
      productId: string;
      storeId: string;
      productName: string;
      productImage: string;
      price: number;
      quantity: number;
    }> = [];
    const lineItems = checkoutItems.map((item) => {
      const product = productsById.get(item.productId)!;

      if (product.stock < item.quantity) {
        throw new Error(`INSUFFICIENT_STOCK:${product.name}`);
      }

      const unitAmount = Math.round(product.price * 100);
      if (!Number.isSafeInteger(unitAmount) || unitAmount < 1) {
        throw new Error("INVALID_DATABASE_PRICE");
      }

      if (!product.storeId) {
        throw new Error("INVALID_PRODUCT_STORE");
      }

      draftItems.push({
        productId: product.id,
        storeId: product.storeId,
        productName: product.name,
        productImage: product.image,
        price: unitAmount / 100,
        quantity: item.quantity,
      });

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            metadata: { productId: product.id },
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const draft = await prisma.checkoutDraft.create({
      data: {
        userId: session.user.id,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        items: draftItems,
      },
    });

    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        client_reference_id: session.user.id,
        customer_email: email.trim(),
        line_items: lineItems,
        success_url: `${stripeEnvironment.appUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${stripeEnvironment.appUrl}/checkout`,
        metadata: {
          userId: session.user.id,
          checkoutDraftId: draft.id,
        },
      });

      if (!checkoutSession.url) {
        await stripe.checkout.sessions.expire(checkoutSession.id).catch(() => undefined);
        throw new Error("MISSING_CHECKOUT_URL");
      }

      try {
        await prisma.checkoutDraft.update({
          where: { id: draft.id },
          data: { stripeSessionId: checkoutSession.id },
        });
      } catch (error) {
        await stripe.checkout.sessions.expire(checkoutSession.id).catch(() => undefined);
        throw error;
      }

      return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
      await prisma.checkoutDraft.deleteMany({ where: { id: draft.id, processedAt: null } });
      throw error;
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("INSUFFICIENT_STOCK:")) {
      const productName = error.message.slice("INSUFFICIENT_STOCK:".length);
      return NextResponse.json(
        { message: `Not enough inventory for ${productName}.` },
        { status: 409 }
      );
    }

    if (error instanceof Error && error.message === "INVALID_DATABASE_PRICE") {
      return NextResponse.json(
        { message: "One or more products have an invalid price." },
        { status: 500 }
      );
    }

    if (error instanceof Error && error.message === "INVALID_PRODUCT_STORE") {
      return NextResponse.json(
        { message: "One or more products are unavailable." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Unable to create a Stripe Checkout Session." },
      { status: 502 }
    );
  }
}
