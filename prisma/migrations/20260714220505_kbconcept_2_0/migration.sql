/*
  Warnings:

  - A unique constraint covering the columns `[uri]` on the table `KBConcept` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[path]` on the table `KBConcept` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `KBConcept` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "KBConceptVisibility" AS ENUM ('public', 'hidden', 'unpublished');

-- AlterTable
ALTER TABLE "KBConcept" ADD COLUMN     "hash" VARCHAR(64),
ADD COLUMN     "intro" TEXT,
ADD COLUMN     "mimetype" VARCHAR(100),
ADD COLUMN     "path" VARCHAR(1024),
ADD COLUMN     "quality" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
ADD COLUMN     "size" DOUBLE PRECISION,
ADD COLUMN     "uri" VARCHAR(1024),
ADD COLUMN     "visibility" "KBConceptVisibility" NOT NULL DEFAULT 'hidden';

-- CreateIndex
CREATE UNIQUE INDEX "KBConcept_uri_key" ON "KBConcept"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "KBConcept_path_key" ON "KBConcept"("path");

-- CreateIndex
CREATE UNIQUE INDEX "KBConcept_hash_key" ON "KBConcept"("hash");

-- CreateIndex
CREATE INDEX "KBConcept_quality_idx" ON "KBConcept"("quality");

-- CreateIndex
CREATE INDEX "KBConcept_visibility_idx" ON "KBConcept"("visibility");
