-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_CreatedBy_fkey";

-- DropIndex
DROP INDEX "File_CreatedBy";

-- RenameColumn
ALTER TABLE "File" RENAME COLUMN "CreatedBy" TO "createdById";

-- CreateIndex
CREATE INDEX "File_CreatedBy" ON "File"("createdById");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
