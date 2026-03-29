#!/bin/bash
# Build script: Compile TypeScript and copy static files
set -e
rm -rf dist
npx tsc
mkdir -p dist/popup
cp src/popup/popup.html dist/popup/
cp src/popup/popup.css dist/popup/
echo "Build complete!"
