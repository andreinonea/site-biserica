#!/bin/bash

git pull

BUILD_VERSION="$(git rev-parse HEAD)"

echo "$(date --utc +%FT%TZ): Releasing new server version ${BUILD_VERSION}"

echo "$(date --utc +%FT%TZ): Running build..."
npm install
npm run build

echo "$(date --utc +%FT%TZ): Restarting PM2 server..."
pm2 restart all

