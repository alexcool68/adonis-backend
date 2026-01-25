# Étape 1 : Base
FROM node:20-alpine AS base

# Installation des dépendances nécessaires pour certaines libs (ex: sharp, python, etc.)
RUN apk --no-cache add curl

# Configuration du répertoire de travail
WORKDIR /app

# Étape 2 : Dépendances
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Étape 3 : Build
FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN node ace build

# Étape 4 : Production
FROM base AS production
ENV NODE_ENV=production
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
COPY --from=build /app/package.json /app/package.json

# Expose le port (Adonis utilise souvent 3333)
EXPOSE 3333

# Commande de démarrage
CMD ["node", "./bin/server.js"]