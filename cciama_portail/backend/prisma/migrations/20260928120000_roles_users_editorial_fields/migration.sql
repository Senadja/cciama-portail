-- ─────────────────────────────────────────────────────────────────────────
-- Roles et comptes utilisateurs, simplification des editeurs de contenu.
-- Les retraits de donnees passent AVANT la suppression des colonnes qui
-- servent a les identifier (kind, code).
-- ─────────────────────────────────────────────────────────────────────────

-- Retraits demandes
-- Famille F5 « SI interne et gestion » : ses fiches S14-S18 suivent (ON DELETE CASCADE).
DELETE FROM "ServiceFamily" WHERE "code" = 'F5';
-- La CCIAMA n'a pas d'organismes sous tutelle : seuls les partenaires restent.
DELETE FROM "Organism" WHERE "kind" = 'organism';
-- Messages de demonstration de la bande flash.
DELETE FROM "FlashInfo";

-- FlashInfo : l'etiquette decoule de la severite ; l'affichage est borne par des dates.
ALTER TABLE "FlashInfo" DROP COLUMN "active",
DROP COLUMN "label",
ADD COLUMN     "endsAt" TIMESTAMP(3),
ADD COLUMN     "startsAt" TIMESTAMP(3);

-- NewsArticle : l'image unique devient la premiere d'une liste ; la date texte
-- (« 21 mai 2026 ») devient une vraie date. Les tables sont vides en production,
-- une base de developpement recoit la date du jour.
ALTER TABLE "NewsArticle" ADD COLUMN "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
UPDATE "NewsArticle" SET "images" = ARRAY["image"] WHERE "image" IS NOT NULL AND "image" <> '';
ALTER TABLE "NewsArticle" DROP COLUMN "catLabel",
DROP COLUMN "dateShort",
DROP COLUMN "image",
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "NewsArticle" ALTER COLUMN "date" DROP DEFAULT;

-- OfficialDocument : libelle de type derive, vraie date.
ALTER TABLE "OfficialDocument" DROP COLUMN "typeLabel",
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "OfficialDocument" ALTER COLUMN "date" DROP DEFAULT;

-- Organism : un logo televerse remplace couleur et symbole ; plus de categorie.
ALTER TABLE "Organism" DROP COLUMN "color",
DROP COLUMN "kind",
DROP COLUMN "mark",
ADD COLUMN     "logo" TEXT;

-- Project : type libre ; la periode texte (« 2024 — 2030 ») est decoupee en annees.
ALTER TABLE "Project" ADD COLUMN "endYear" INTEGER,
ADD COLUMN     "startYear" INTEGER,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT '';
UPDATE "Project" SET
  "startYear" = COALESCE(substring("period" from '([0-9]{4})')::int, EXTRACT(YEAR FROM CURRENT_DATE)::int),
  "endYear"   = substring("period" from '[0-9]{4}[^0-9]+([0-9]{4})')::int;
ALTER TABLE "Project" ALTER COLUMN "startYear" SET NOT NULL;
ALTER TABLE "Project" DROP COLUMN "budget",
DROP COLUMN "period",
DROP COLUMN "statusLabel";

-- User : identifiant par matricule, mot de passe provisoire a changer.
ALTER TABLE "User" ADD COLUMN     "matricule" TEXT,
ADD COLUMN     "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'EDITOR';

CREATE UNIQUE INDEX "User_matricule_key" ON "User"("matricule");
