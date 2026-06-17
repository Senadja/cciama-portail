-- CreateTable
CREATE TABLE "ServiceFamily" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "beneficiaries" TEXT NOT NULL,
    "channels" TEXT NOT NULL,
    "targetDelay" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "processSteps" JSONB NOT NULL,
    "screens" JSONB NOT NULL,
    "dataFields" JSONB NOT NULL,
    "integrations" JSONB NOT NULL,
    "kpis" JSONB NOT NULL,
    "businessRules" JSONB NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceFamily_code_key" ON "ServiceFamily"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Service_code_key" ON "Service"("code");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "ServiceFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;
