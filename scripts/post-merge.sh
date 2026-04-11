#!/bin/bash
set -e

# Post-merge setup for SuburbMates
# Runs automatically after a task agent merge.
# Must be non-interactive (stdin is closed).

echo "[post-merge] Installing npm dependencies..."
npm install --legacy-peer-deps

echo "[post-merge] Done."
