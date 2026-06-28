-- CreateEnum
CREATE TYPE "OrderPrintStatus" AS ENUM ('pending', 'printed', 'failed');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "printStatus" "OrderPrintStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "printedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "orders_printStatus_idx" ON "orders"("printStatus");
