CREATE TABLE "CheckoutDraft" (
    "id" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "CheckoutDraft_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CheckoutDraft_stripeSessionId_key" ON "CheckoutDraft"("stripeSessionId");
CREATE INDEX "CheckoutDraft_userId_idx" ON "CheckoutDraft"("userId");
CREATE INDEX "CheckoutDraft_createdAt_idx" ON "CheckoutDraft"("createdAt");
CREATE UNIQUE INDEX "Order_checkoutSessionId_storeId_key" ON "Order"("checkoutSessionId", "storeId");

ALTER TABLE "CheckoutDraft"
ADD CONSTRAINT "CheckoutDraft_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
