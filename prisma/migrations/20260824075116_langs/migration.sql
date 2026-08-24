-- AlterTable
ALTER TABLE "KBConcept" ADD COLUMN     "en" JSONB,
ADD COLUMN     "vi" JSONB;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "en" JSONB,
ADD COLUMN     "vi" JSONB;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "en" JSONB,
ADD COLUMN     "vi" JSONB;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "en" JSONB,
ADD COLUMN     "vi" JSONB;

-- AlterTable
ALTER TABLE "TaskWorkLog" ADD COLUMN     "en" JSONB,
ADD COLUMN     "vi" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "en" JSONB,
ADD COLUMN     "vi" JSONB;
