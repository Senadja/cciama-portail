# Portail CCIAMA — démarrage & CMS des services

Portail web institutionnel de la CCIAMA du Tchad avec un **CMS complet**.
Tout le contenu du portail est modélisé, persisté en base, affiché côté public et
éditable depuis la console d'administration :
- **Phase 1** : catalogue des **18 services** du document `Catalogue_Services_CCIAMA_Tchad` (fiches détaillées — 7 rubriques).
- **Phase 2** : actualités, documentation officielle, projets, organismes & partenaires, bande flash, accès rapides.

## Pile technique
- **Backend** : NestJS 11 + Prisma 7 (PostgreSQL), via le driver adapter `pg`.
- **Frontend** : React 19 + Vite + TanStack Query + Zustand.
- **Infra (Docker)** : PostgreSQL, Redis, Keycloak, MinIO, RabbitMQ, Meilisearch.

## Prérequis
- Docker Desktop démarré
- Node.js 22+

## Démarrage (depuis `cciama_portail/`)

```bash
# 1. Infrastructure (6 conteneurs)
cd backend
docker compose up -d

# 2. Backend (port 3000)
npm install --legacy-peer-deps     # une seule fois
npx prisma generate                # une seule fois (ou après modif du schéma)
npx prisma migrate deploy          # applique les migrations
npm run seed                       # insère les 5 familles + 18 services (idempotent)
npm run start:dev                  # API sur http://localhost:3000/api/v1

# 3. Frontend (dans un autre terminal, port 5173)
cd ../frontend
npm install                        # une seule fois
npm run dev                        # http://localhost:5173
```

> `npm install` du backend exige `--legacy-peer-deps` : `nest-keycloak-connect`
> déclare une peer-dependency NestJS < 11 alors que le projet est en NestJS 11.

## Accès
- **Portail public** : http://localhost:5173
- **Catalogue des services** : http://localhost:5173/services
- **Fiche d'un service** : http://localhost:5173/services/S01 … S18
- **Console d'administration** : http://localhost:5173/admin
  - Connexion : **admin@cciama-tchad.com** / **admin123** (compte créé automatiquement au démarrage).
- **API catalogue** : http://localhost:3000/api/v1/content/services
- **API contenus** : `/content/news`, `/content/documents`, `/content/projects`, `/content/organisms`, `/content/flash`, `/content/quick-actions`

## Ce qui a été ajouté (Phase 1 — catalogue des services)

### Données (`backend/prisma/`)
- Modèles `ServiceFamily` et `Service` dans `schema.prisma`
  (rubriques détaillées stockées en colonnes `Json`).
- `seed.ts` + `seed-data/services.json` : les 18 fiches extraites **verbatim**
  du document (processus, écrans, données métier, intégrations, KPIs, règles).

### Backend (`backend/src/features/cms/`)
- `services.service.ts` / `services.controller.ts` : CRUD complet.
  - Lecture publique : `GET /content/services`, `/content/services/code/:code`,
    `/content/services/families`.
  - Écriture (console admin) : `POST` / `PUT` / `DELETE /content/services/:id`,
    `PUT /content/services/reorder`, `PUT /content/services/families/:id`.
  - Émission SSE + journal `ContentUpdateHistory` (comme les autres modules CMS).

### Frontend
- `features/services/ServicesCatalog.tsx` : catalogue public groupé par famille
  (filtre par famille) + fiche détaillée affichant les 7 rubriques.
- `features/admin/views/AdminServicesEditor.tsx` : éditeur CRUD complet
  (toutes les rubriques + listes dynamiques) + édition du texte des familles.
- Hooks `useCms.ts`, client `api.ts`, événements SSE `useSse.ts` étendus.

### Phase 2 — contenus éditoriaux (livrée)
- **Modèles** : `NewsArticle`, `OfficialDocument`, `Project`, `Organism`
  (organismes + partenaires via `kind`), `FlashInfo`, `QuickAction`.
- **Backend** : un module CRUD par entité (`news`, `documents`, `projects`,
  `organisms`, `flash`, `quick-actions`) sous `/content/...`, avec SSE + audit.
- **Seed** : contenus existants portés (`prisma/seed-data/editorial.json`),
  insérés uniquement si la table est vide (préserve les modifications admin).
- **Frontend public** : accueil, actualités (+ article), documentation, projets,
  organismes, bande flash désormais branchés sur l'API.
- **Frontend admin** : éditeur générique `CollectionEditor` + 6 configurations
  (`collectionConfigs.tsx`) — table + formulaire CRUD pour chaque collection.

> Correctif : l'URL de connexion du frontend pointait sur `/api` au lieu de
> `/api/v1` (login impossible) — corrigé dans `LoginPage.tsx`.

### Téléversement de fichiers (MinIO — livré)
- Champ d'upload réutilisable dans `CollectionEditor` (types `image` / `file`).
- **Actualités** : image principale (PNG/JPEG/WebP, optimisée en WebP par `sharp`).
- **Documentation** : fichier PDF (boutons aperçu/téléchargement actifs côté public).
- S'appuie sur l'infra existante `/admin/media/upload` (validation des magic bytes,
  stockage MinIO, URL renvoyée stockée dans `image` / `fileUrl`).
- **Liens permanents** : le bucket `cciama-uploads` est passé en **lecture publique**
  (policy appliquée au démarrage dans `MinioService`), et les URLs renvoyées sont des
  **URLs directes** (`http://localhost:9000/cciama-uploads/...`) — pas d'expiration.
  Ce changement profite aussi aux images existantes (accueil, portrait).

## Reste possible (non demandé)
- Données du suivi de dossier (`tracker`) encore simulées côté front.
- Gestion fine des utilisateurs/rôles dans la console.
