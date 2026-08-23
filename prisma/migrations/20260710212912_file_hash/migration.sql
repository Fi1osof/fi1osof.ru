/*
  Warnings:

  - You are about to alter the column `hash` on the `File` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - A unique constraint covering the columns `[hash]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "File" ALTER COLUMN "hash" SET DATA TYPE VARCHAR(64);

-- CreateIndex
CREATE UNIQUE INDEX "File_hash_key" ON "File"("hash");
