#!/bin/bash

# Script to fix Puppeteer Chrome installation on Render
# Run this script before starting your Node.js application

echo "Starting Puppeteer Fix Script for Render Environment"

# Check if running on Render
if [[ -n "$RENDER" || -n "$RENDER_EXTERNAL_URL" ]]; then
  echo "Detected Render environment"

  # Install Chromium if not already installed
  if ! command -v chromium-browser &> /dev/null && ! command -v chromium &> /dev/null; then
    echo "Installing Chromium..."
    apt-get update
    apt-get install -y chromium chromium-l10n
  else
    echo "Chromium already installed"
  fi

  # Find the Chromium executable path
  CHROMIUM_PATH=""
  for path in "/usr/bin/chromium-browser" "/usr/bin/chromium" "/usr/bin/chrome" "/usr/bin/google-chrome" "/usr/bin/google-chrome-stable"; do
    if [[ -f "$path" ]]; then
      CHROMIUM_PATH="$path"
      break
    fi
  done

  if [[ -n "$CHROMIUM_PATH" ]]; then
    echo "Found Chromium at: $CHROMIUM_PATH"
    # Export environment variables for Puppeteer
    export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
    export PUPPETEER_EXECUTABLE_PATH="$CHROMIUM_PATH"
    echo "Set PUPPETEER_EXECUTABLE_PATH=$PUPPETEER_EXECUTABLE_PATH"
  else
    echo "Error: Could not find Chromium installation!"
    exit 1
  fi
else
  echo "Not running on Render, skipping Chromium installation"
fi

echo "Puppeteer fix script completed"

# Continue with your application
echo "Starting the main application..."
exec "$@" 