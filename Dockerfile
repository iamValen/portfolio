# install web deps once, cached until they actually change
FROM node:24-alpine AS web-deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY web/package.json ./web/package.json
RUN npm ci

# build the static site
FROM web-deps AS web-build
COPY . .
# vite build only. type checking runs locally / in dev, no need to gate the image on it
RUN npm exec --workspace web -- vite build

# serve the build with caddy, which also reverse proxies /api to the notes api
FROM caddy:2-alpine AS web
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=web-build /app/web/dist /srv
EXPOSE 80

# build the spring boot api with the gradle wrapper
FROM eclipse-temurin:21-jdk AS api-build
WORKDIR /app
COPY server/ .
RUN chmod +x gradlew && ./gradlew bootJar --no-daemon

# run it on a plain jre
FROM eclipse-temurin:21-jre AS api
WORKDIR /app
COPY --from=api-build /app/build/libs/*.jar app.jar
ENV PORT=8787
EXPOSE 8787
CMD ["java", "-jar", "app.jar"]
