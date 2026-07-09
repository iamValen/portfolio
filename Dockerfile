# build the static site
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# version shown in the hero, passed in from the host's git at build time
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION

# vite build only. type checking runs locally / in dev, no need to gate the image on it
RUN npx vite build

# serve the build with caddy
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
EXPOSE 80
