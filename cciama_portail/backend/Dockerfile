# ── CCIAMA backend — NestJS 11 + Prisma 7 (driver adapter @prisma/adapter-pg) ──
# Image unique volontaire : la CLI Prisma + ts-node restent disponibles au runtime
# pour jouer `migrate deploy` puis `seed` au démarrage du conteneur.
FROM node:22-bookworm-slim

# openssl : requis par le moteur de migration Prisma ; ca-certificates : TLS sortant
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Dépendances (dev incluses : @nestjs/cli pour build, prisma + ts-node pour migrate/seed)
#    --legacy-peer-deps : nest-keycloak-connect déclare un peer @nestjs/common <11
#    alors que le projet est en NestJS 11 (conflit connu, tree local OK).
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# 2. Génération du client Prisma (nécessite le schéma)
COPY prisma ./prisma
RUN npx prisma generate

# 3. Code source + build NestJS
COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Démarrage : migrations (idempotent) → seed catalogue/contenus (idempotent) → app
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && node dist/main"]
