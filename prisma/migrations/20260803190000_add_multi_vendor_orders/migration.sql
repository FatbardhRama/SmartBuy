-- Add order ownership and immutable product snapshots as nullable columns so
-- existing rows can be backfilled before the required constraints are applied.
ALTER TABLE "Order" ADD COLUMN "storeId" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "productName" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "productImage" TEXT;

-- Snapshot the current product presentation for historical order rendering.
UPDATE "OrderItem" AS oi
SET
    "productName" = p."name",
    "productImage" = p."image"
FROM "Product" AS p
WHERE oi."productId" = p."id";

-- Existing pre-marketplace orders belong to the store attached to their items.
UPDATE "Order" AS o
SET "storeId" = source."storeId"
FROM (
    SELECT DISTINCT ON (oi."orderId") oi."orderId", p."storeId"
    FROM "OrderItem" AS oi
    JOIN "Product" AS p ON p."id" = oi."productId"
    WHERE p."storeId" IS NOT NULL
    ORDER BY oi."orderId", oi."id"
) AS source
WHERE o."id" = source."orderId";

-- Products created through the legacy admin flow could have remained
-- storeless after the original marketplace backfill. Historical orders for
-- those products belong to the canonical SmartBuy Official store.
UPDATE "Order" AS o
SET "storeId" = official."id"
FROM "Store" AS official
WHERE o."storeId" IS NULL
  AND official."slug" = 'smartbuy-official';

-- Fail loudly rather than silently creating ownerless historical orders.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Order" WHERE "storeId" IS NULL) THEN
        RAISE EXCEPTION 'Cannot backfill Order.storeId: SmartBuy Official store is missing';
    END IF;
END $$;

ALTER TABLE "Order" ALTER COLUMN "storeId" SET NOT NULL;
ALTER TABLE "OrderItem" ALTER COLUMN "productName" SET NOT NULL;
ALTER TABLE "OrderItem" ALTER COLUMN "productImage" SET NOT NULL;

CREATE INDEX "Order_storeId_idx" ON "Order"("storeId");

ALTER TABLE "Order" ADD CONSTRAINT "Order_storeId_fkey"
FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Keep historical order items after a product is removed.
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";
ALTER TABLE "OrderItem" ALTER COLUMN "productId" DROP NOT NULL;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
