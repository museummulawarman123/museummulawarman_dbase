-- CreateEnum
CREATE TYPE "AcquisitionMethod" AS ENUM ('HADIAH', 'GANTI_RUGI', 'BELI', 'TEMUAN', 'HIBAH', 'LAINNYA');

-- AlterTable
ALTER TABLE "CollectionItem" ADD COLUMN     "acquisition" "AcquisitionMethod",
ADD COLUMN     "diameterBottom" INTEGER,
ADD COLUMN     "diameterMiddle" INTEGER,
ADD COLUMN     "diameterTop" INTEGER,
ADD COLUMN     "placeFound" TEXT,
ADD COLUMN     "placeMade" TEXT;
