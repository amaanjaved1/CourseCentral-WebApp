#!/bin/bash

# Exit on error
set -e

# Log deployment info
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the application
echo "Building the application..."
npm run build

# Print success message
echo "Build completed successfully!" 