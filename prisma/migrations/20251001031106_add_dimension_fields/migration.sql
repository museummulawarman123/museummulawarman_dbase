/*
  Warnings:

  - You are about to drop the column `acquisition` on the `CollectionItem` table. All the data in the column will be lost.
  - You are about to drop the column `diameterBottom` on the `CollectionItem` table. All the data in the column will be lost.
  - You are about to drop the column `diameterMiddle` on the `CollectionItem` table. All the data in the column will be lost.
  - You are about to drop the column `placeFound` on the `CollectionItem` table. All the data in the column will be lost.
  - You are about to drop the column `placeMade` on the `CollectionItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CollectionItem" DROP COLUMN "acquisition",
DROP COLUMN "diameterBottom",
DROP COLUMN "diameterMiddle",
DROP COLUMN "placeFound",
DROP COLUMN "placeMade",
ADD COLUMN     "acquisitionMethod" "AcquisitionMethod",
ADD COLUMN     "diameterBot" INTEGER,
ADD COLUMN     "diameterMid" INTEGER,
ADD COLUMN     "foundPlace" TEXT,
ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "originPlace" TEXT;
