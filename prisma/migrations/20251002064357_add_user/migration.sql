/*
  Warnings:

  - You are about to drop the column `imagePath` on the `CollectionItem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."CollectionItem_category_idx";

-- AlterTable
ALTER TABLE "CollectionItem" DROP COLUMN "imagePath";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
