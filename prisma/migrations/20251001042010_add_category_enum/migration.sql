/*
  Warnings:

  - The `category` column on the `CollectionItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('GEOLOGIKA', 'BIOLOGIKA', 'ETNOGRAFIKA', 'ARKEOLOGIKA', 'HISTORIKA', 'NUMISMATIKA_HERALDIKA', 'FILOLOGIKA', 'KERAMOLOGIKA', 'SENI_RUPA', 'TEKNOLOGIKA');

-- AlterTable
ALTER TABLE "CollectionItem" DROP COLUMN "category",
ADD COLUMN     "category" "Category";

-- CreateIndex
CREATE INDEX "CollectionItem_category_idx" ON "CollectionItem"("category");
