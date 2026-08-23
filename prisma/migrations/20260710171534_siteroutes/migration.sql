-- CreateTable
CREATE TABLE "SiteRoute" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "path" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,
    "kBConceptId" TEXT,
    "createdById" VARCHAR(36) NOT NULL,

    CONSTRAINT "SiteRoute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteRoute_path_key" ON "SiteRoute"("path");

-- CreateIndex
CREATE UNIQUE INDEX "SiteRoute_kBConceptId_key" ON "SiteRoute"("kBConceptId");

-- CreateIndex
CREATE INDEX "SiteRoute_createdById_idx" ON "SiteRoute"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "SiteRoute_parentId_slug_key" ON "SiteRoute"("parentId", "slug");

-- AddForeignKey
ALTER TABLE "SiteRoute" ADD CONSTRAINT "SiteRoute_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SiteRoute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteRoute" ADD CONSTRAINT "SiteRoute_kBConceptId_fkey" FOREIGN KEY ("kBConceptId") REFERENCES "KBConcept"("id") ON DELETE SET NULL ON UPDATE CASCADE;
