CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

ALTER TABLE "Order"
ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "checkoutSessionId" TEXT,
ADD COLUMN "paymentIntentId" TEXT,
ADD COLUMN "paidAt" TIMESTAMP(3);

CREATE INDEX "Order_checkoutSessionId_idx" ON "Order"("checkoutSessionId");
CREATE INDEX "Order_paymentIntentId_idx" ON "Order"("paymentIntentId");
