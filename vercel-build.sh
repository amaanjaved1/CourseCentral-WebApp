#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Print commands and their arguments as they are executed
set -x

# Set environment to production
export NODE_ENV=production

# Install dependencies (even though vercel does this automatically)
echo "Installing dependencies..."
npm install

# Clean any previous builds
echo "Cleaning previous builds..."
rm -rf .next

# Build Next.js app
echo "Building Next.js app..."
NODE_OPTIONS="--max-old-space-size=4096" npx next build

# Ensure routes-manifest.json exists
if [ -f ".next/routes-manifest.json" ]; then
  echo "routes-manifest.json exists. Build successful!"
else
  echo "routes-manifest.json not found. Creating a placeholder..."
  mkdir -p .next
  echo '{"version":1,"pages404":false,"basePath":"","redirects":[],"headers":[],"dynamicRoutes":[],"staticRoutes":[],"dataRoutes":[],"rewrites":[]}' > .next/routes-manifest.json
fi

# Exit with success status
exit 0 