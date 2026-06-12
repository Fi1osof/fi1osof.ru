-- CreateTable
CREATE TABLE "Timer" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stoppedAt" TIMESTAMP(3),
    "taskId" VARCHAR(36) NOT NULL,
    "createdById" VARCHAR(36) NOT NULL,

    CONSTRAINT "Timer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Timer_taskId_idx" ON "Timer"("taskId");

-- CreateIndex
CREATE INDEX "Timer_createdById_idx" ON "Timer"("createdById");

-- AddForeignKey
ALTER TABLE "Timer" ADD CONSTRAINT "Timer_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timer" ADD CONSTRAINT "Timer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
