-- CreateTable
CREATE TABLE "PlatformSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomePageContent" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "heroEyebrow" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroDesc" TEXT NOT NULL,
    "heroCtaText" TEXT NOT NULL,
    "heroCtaLink" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "missionEye" TEXT NOT NULL,
    "missionTitle" TEXT NOT NULL,
    "missionDesc" TEXT NOT NULL,
    "stats" JSONB NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinisterWordContent" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "eyebrow" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lead" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "portrait" TEXT NOT NULL,
    "welcomeTitle" TEXT NOT NULL,
    "para1" TEXT NOT NULL,
    "para2" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "para3" TEXT NOT NULL,
    "bioFile" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MinisterWordContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionMission" (
    "id" TEXT NOT NULL,
    "num" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionMission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganigramNode" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganigramNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "altText" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentUpdateHistory" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentUpdateHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "firstName" TEXT,
    "lastName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformSetting_key_key" ON "PlatformSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "OrganigramNode" ADD CONSTRAINT "OrganigramNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "OrganigramNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
