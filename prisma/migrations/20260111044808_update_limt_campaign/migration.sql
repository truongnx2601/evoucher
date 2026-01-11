/*
  Warnings:

  - Added the required column `maxVoucher` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Campaign_prefix_key";

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "maxVoucher" INTEGER NOT NULL;
