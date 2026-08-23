-- CreateEnum
CREATE TYPE "RedirectPatternType" AS ENUM ('regex', 'prefix', 'exact');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('open', 'resolved', 'ignored');

-- CreateEnum
CREATE TYPE "SystemLogLevel" AS ENUM ('error', 'warning', 'info', 'debug');

-- CreateEnum
CREATE TYPE "SystemLogSource" AS ENUM ('client', 'server', 'api');

-- CreateTable
CREATE TABLE "SystemLog" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" "SystemLogLevel" NOT NULL DEFAULT 'info',
    "source" "SystemLogSource" NOT NULL DEFAULT 'server',
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "url" TEXT,
    "path" VARCHAR(2048),
    "statusCode" INTEGER,
    "method" VARCHAR(10),
    "userAgent" TEXT,
    "robotType" VARCHAR(50),
    "ip" VARCHAR(45),
    "referer" TEXT,
    "headers" JSONB,
    "data" JSONB,
    "redirectRuleId" VARCHAR(36),
    "incidentId" VARCHAR(36),

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedirectRule" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "pattern" TEXT NOT NULL,
    "patternType" "RedirectPatternType" NOT NULL DEFAULT 'regex',
    "replacement" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 301,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "comment" TEXT,

    CONSTRAINT "RedirectRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" VARCHAR(36) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(500) NOT NULL,
    "pattern" TEXT,
    "patternType" "RedirectPatternType",
    "status" "IncidentStatus" NOT NULL DEFAULT 'open',
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" VARCHAR(36),

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SystemLog_level_idx" ON "SystemLog"("level");

-- CreateIndex
CREATE INDEX "SystemLog_source_idx" ON "SystemLog"("source");

-- CreateIndex
CREATE INDEX "SystemLog_statusCode_idx" ON "SystemLog"("statusCode");

-- CreateIndex
CREATE INDEX "SystemLog_path_idx" ON "SystemLog"("path");

-- CreateIndex
CREATE INDEX "SystemLog_createdAt_idx" ON "SystemLog"("createdAt");

-- CreateIndex
CREATE INDEX "SystemLog_robotType_idx" ON "SystemLog"("robotType");

-- CreateIndex
CREATE INDEX "SystemLog_incidentId_idx" ON "SystemLog"("incidentId");

-- CreateIndex
CREATE INDEX "SystemLog_redirectRuleId_idx" ON "SystemLog"("redirectRuleId");

-- CreateIndex
CREATE INDEX "RedirectRule_enabled_idx" ON "RedirectRule"("enabled");

-- CreateIndex
CREATE INDEX "RedirectRule_priority_idx" ON "RedirectRule"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "RedirectRule_pattern_patternType_key" ON "RedirectRule"("pattern", "patternType");

-- CreateIndex
CREATE INDEX "Incident_status_idx" ON "Incident"("status");

-- CreateIndex
CREATE INDEX "Incident_createdAt_idx" ON "Incident"("createdAt");

-- CreateIndex
CREATE INDEX "Incident_resolvedById_idx" ON "Incident"("resolvedById");

-- AddForeignKey
ALTER TABLE "SystemLog" ADD CONSTRAINT "SystemLog_redirectRuleId_fkey" FOREIGN KEY ("redirectRuleId") REFERENCES "RedirectRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemLog" ADD CONSTRAINT "SystemLog_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
