-- CreateTable
CREATE TABLE "NewsArticle" (
    "id" TEXT NOT NULL,
    "cat" TEXT NOT NULL,
    "catLabel" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "dateShort" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "readTime" TEXT NOT NULL,
    "image" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficialDocument" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "typeLabel" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "fileUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficialDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statusLabel" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "partner" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "desc" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organism" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "mark" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organism_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlashInfo" (
    "id" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlashInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuickAction" (
    "id" TEXT NOT NULL,
    "ic" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "link" TEXT NOT NULL DEFAULT '/services',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuickAction_pkey" PRIMARY KEY ("id")
);
