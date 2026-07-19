#!/bin/bash
# Production build for GitHub Pages. Syncs the sample .xsvg sources from the sibling
# xsvg repo (if present) into static/dataset/, then builds the static site into dist/.
set -e

npm install --legacy-peer-deps
npx -y update-browserslist-db@latest || true

node scripts/sync-dataset.mjs

[[ -d build ]] && rm -r build
[[ -d dist ]] && rm -r dist
npm run build
mv build dist
