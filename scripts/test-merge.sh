#!/bin/bash

# Test Merge Script
# Purpose: Run all tests after resolving merge conflicts
# Usage: ./scripts/test-merge.sh

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
  echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

log "Running comprehensive test suite..."
echo ""

# TypeScript compilation
log "1. TypeScript compilation..."
if npm run build; then
  echo -e "${GREEN}✓ Build passed${NC}"
else
  error "Build failed"
  exit 1
fi

echo ""

# Linting
log "2. Linting..."
if npm run lint; then
  echo -e "${GREEN}✓ Lint passed${NC}"
else
  error "Lint failed"
  exit 1
fi

echo ""

# Unit tests
log "3. Unit tests..."
if npm run test; then
  echo -e "${GREEN}✓ Tests passed${NC}"
else
  error "Tests failed"
  exit 1
fi

echo ""
log "========================================="
log "✓ All tests passed!"
log "========================================="
