# ── CCIAMA frontend — build Vite (React 19) puis service statique via nginx ──
FROM node:22-bookworm-slim AS build
WORKDIR /app

# VITE_API_URL est figée AU BUILD (URL publique du backend, suffixée /api/v1)
ARG VITE_API_URL=http://localhost:3000/api/v1
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Service statique ──
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
