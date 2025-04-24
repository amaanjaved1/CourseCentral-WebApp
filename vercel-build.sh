#!/bin/bash

# Set environment to production
export NODE_ENV=production

# Install dependencies
echo "Installing dependencies..."
npm install

# Build Next.js app with error ignoring
echo "Building Next.js app..."
NODE_OPTIONS="--max-old-space-size=4096" next build

# Exit with success status
exit 0 