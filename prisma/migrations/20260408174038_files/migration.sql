-- CreateTable
CREATE TABLE "File" (
    "id" VARCHAR(36) NOT NULL,
    "path" TEXT NOT NULL,
    "name" TEXT,
    "filename" TEXT,
    "mimetype" TEXT NOT NULL,
    "encoding" TEXT NOT NULL,
    "hash" TEXT,
    "size" DECIMAL(65,30),
    "CreatedBy" VARCHAR(36),
    "rank" INTEGER,
    "Gallery" VARCHAR(36),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "File_CreatedBy" ON "File"("CreatedBy");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
