#!/bin/bash

# Messenger Focus Extension - Export Script
# This script builds and packages the extension as a ZIP for distribution

set -e

echo "🎯 Messenger Focus Extension - Packager"
echo "========================================"
echo ""

# Build the extension
echo "📦 Building extension..."
bash build.sh

echo ""
echo "📦 Creating distribution package..."

# Detect OS and use appropriate zip method
if command -v powershell &> /dev/null; then
    # Windows with PowerShell
    powershell -Command "Compress-Archive -Path dist -DestinationPath 'Messenger-Focus-Extension.zip' -Force"
elif command -v zip &> /dev/null; then
    # Unix/Linux with zip command
    cd dist
    zip -r ../Messenger-Focus-Extension.zip .
    cd ..
else
    echo "❌ Error: Neither PowerShell nor zip command found."
    echo ""
    echo "📋 Manual alternative:"
    echo "   1. Right-click the 'dist' folder"
    echo "   2. Select 'Send to' > 'Compressed (zipped) folder'"
    echo "   3. Rename it to 'Messenger-Focus-Extension.zip'"
    exit 1
fi

echo ""
echo "✅ Success! Extension packaged: Messenger-Focus-Extension.zip"
echo ""
echo "📍 Location: $(pwd)/Messenger-Focus-Extension.zip"
echo ""
echo "📤 Distribution:"
echo "   - Share 'Messenger-Focus-Extension.zip' with anyone"
echo "   - They extract it and load the 'dist' folder"
echo "   - Or drag the dist folder onto chrome://extensions/"
echo ""
echo "🌐 Supported browsers:"
echo "   - Chrome, Brave, Edge, Opera"
echo "   - Firefox (sideload as temporary add-on)"
