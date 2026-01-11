/*
  Warnings:

  - A unique constraint covering the columns `[campaignId,employeeId]` on the table `Voucher` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Voucher_campaignId_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_campaignId_employeeId_key" ON "Voucher"("campaignId", "employeeId");
