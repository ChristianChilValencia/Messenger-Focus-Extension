#!/bin/bash
# Build script: Compile TypeScript and copy static files
set -e
rm -rf dist
npx tsc
mkdir -p dist/popup/icons
cp src/popup/popup.html dist/popup/
cp src/popup/popup.css dist/popup/
cp src/popup/icons/* dist/popup/icons/
echo "Build complete!"
