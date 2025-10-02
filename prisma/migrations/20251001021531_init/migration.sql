-- CreateTable
CREATE TABLE "CollectionItem" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regNumber" TEXT,
    "invNumber" TEXT,
    "description" TEXT,
    "period" TEXT,
    "material" TEXT,
    "imageUrl" TEXT,
    "category" TEXT,
    "lengthCm" INTEGER,
    "widthCm" INTEGER,
    "heightCm" INTEGER,
    "weightGr" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollectionItem_slug_key" ON "CollectionItem"("slug");

-- CreateIndex
CREATE INDEX "CollectionItem_slug_idx" ON "CollectionItem"("slug");

-- CreateIndex
CREATE INDEX "CollectionItem_name_idx" ON "CollectionItem"("name");

-- CreateIndex
CREATE INDEX "CollectionItem_category_idx" ON "CollectionItem"("category");
