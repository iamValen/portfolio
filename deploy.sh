#!/usr/bin/env bash
set -euo pipefail

# pull latest code + tags, rebuild the image with the current version, restart
git pull --tags origin main
export APP_VERSION="$(git describe --tags --always --dirty 2>/dev/null || echo dev)"

echo "deploying $APP_VERSION"
docker compose up -d --build
docker image prune -f
