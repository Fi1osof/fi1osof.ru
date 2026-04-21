-- CreateTable
CREATE TABLE "KBConceptFile" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kBConceptId" VARCHAR(36) NOT NULL,
    "fileId" VARCHAR(36) NOT NULL,
    "createdById" VARCHAR(36),

    CONSTRAINT "KBConceptFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KBConceptFile_createdById_idx" ON "KBConceptFile"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "KBConceptFile_kBConceptId_fileId_key" ON "KBConceptFile"("kBConceptId", "fileId");

-- AddForeignKey
ALTER TABLE "KBConceptFile" ADD CONSTRAINT "KBConceptFile_kBConceptId_fkey" FOREIGN KEY ("kBConceptId") REFERENCES "KBConcept"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KBConceptFile" ADD CONSTRAINT "KBConceptFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
