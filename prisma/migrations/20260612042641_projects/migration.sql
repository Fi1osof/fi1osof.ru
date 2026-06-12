-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('New', 'Idea', 'Accepted', 'Rejected', 'Active', 'Completed', 'Reopened');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "projectId" VARCHAR(36);

-- CreateTable
CREATE TABLE "Project" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "intro" TEXT,
    "content" TEXT,
    "image" VARCHAR(1024),
    "commercial" BOOLEAN NOT NULL,
    "status" "ProjectStatus" DEFAULT 'New',
    "createdById" VARCHAR(36) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_createdById_idx" ON "Project"("createdById");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
