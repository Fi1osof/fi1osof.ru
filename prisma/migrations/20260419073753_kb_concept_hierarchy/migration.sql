/*
  Warnings:

  - A unique constraint covering the columns `[rootId,code]` on the table `KBConcept` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[parentId,code]` on the table `KBConcept` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "KBConcept" ADD COLUMN     "code" VARCHAR(100),
ADD COLUMN     "data" JSONB,
ADD COLUMN     "parentId" VARCHAR(36),
ADD COLUMN     "rootId" VARCHAR(36);

-- CreateIndex
CREATE INDEX "KBConcept_parentId_idx" ON "KBConcept"("parentId");

-- CreateIndex
CREATE INDEX "KBConcept_rootId_idx" ON "KBConcept"("rootId");

-- CreateIndex
CREATE INDEX "KBConcept_type_idx" ON "KBConcept"("type");

-- CreateIndex
CREATE INDEX "KBConcept_code_idx" ON "KBConcept"("code");

-- CreateIndex
CREATE UNIQUE INDEX "KBConcept_rootId_code_key" ON "KBConcept"("rootId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "KBConcept_parentId_code_key" ON "KBConcept"("parentId", "code");

-- AddForeignKey
ALTER TABLE "KBConcept" ADD CONSTRAINT "KBConcept_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "KBConcept"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBConcept" ADD CONSTRAINT "KBConcept_rootId_fkey" FOREIGN KEY ("rootId") REFERENCES "KBConcept"("id") ON DELETE SET NULL ON UPDATE CASCADE;
