#!/bin/bash

# Branch Merge Helper Script
# Purpose: Automate the branch merge process with safety checks
# Usage: ./scripts/merge-branch.sh <branch-name>

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if branch name provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: Branch name required${NC}"
  echo "Usage: ./scripts/merge-branch.sh <branch-name>"
  exit 1
fi

BRANCH_NAME="$1"
MERGE_BRANCH="merge/$BRANCH_NAME"
LOG_FILE="/tmp/merge-log-$(date +%Y%m%d-%H%M%S).txt"

# Function to log messages
log() {
  echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Start merge process
log "Starting merge process for branch: $BRANCH_NAME"
log "Log file: $LOG_FILE"

# Step 1: Ensure we're on main and up to date
log "Step 1: Updating main branch..."
git checkout main || { error "Failed to checkout main"; exit 1; }
git pull origin main || { error "Failed to pull main"; exit 1; }

# Step 2: Check if branch exists
log "Step 2: Checking if branch exists..."
if ! git ls-remote --heads origin "$BRANCH_NAME" | grep -q "$BRANCH_NAME"; then
  error "Branch $BRANCH_NAME does not exist on remote"
  exit 1
fi

# Step 3: Create merge branch
log "Step 3: Creating merge branch $MERGE_BRANCH..."
git checkout -b "$MERGE_BRANCH" || { error "Failed to create merge branch"; exit 1; }

# Step 4: Fetch the branch
log "Step 4: Fetching branch from remote..."
git fetch origin "$BRANCH_NAME" || { error "Failed to fetch branch"; exit 1; }

# Step 5: Attempt merge
log "Step 5: Merging origin/$BRANCH_NAME into $MERGE_BRANCH..."
if git merge "origin/$BRANCH_NAME" --no-ff -m "Merge $BRANCH_NAME into main"; then
  log "✓ Merge successful (no conflicts)"
else
  warning "Merge conflicts detected. Please resolve manually:"
  git status
  echo ""
  echo -e "${YELLOW}To resolve:${NC}"
  echo "1. Fix conflicts in the listed files"
  echo "2. Run: git add <resolved-files>"
  echo "3. Run: git commit -m 'Resolve merge conflicts in $BRANCH_NAME'"
  echo "4. Continue with: ./scripts/test-merge.sh"
  exit 1
fi

# Step 6: Run tests
log "Step 6: Running tests..."
echo ""

log "6a. TypeScript compilation..."
if npm run build; then
  log "✓ Build passed"
else
  error "Build failed. Fix errors and run: ./scripts/test-merge.sh"
  exit 1
fi

echo ""
log "6b. Linting..."
if npm run lint; then
  log "✓ Lint passed"
else
  error "Lint failed. Fix errors and run: ./scripts/test-merge.sh"
  exit 1
fi

echo ""
log "6c. Unit tests..."
if npm run test; then
  log "✓ Tests passed"
else
  error "Tests failed. Fix tests and run: ./scripts/test-merge.sh"
  exit 1
fi

# Step 7: Summary
echo ""
log "========================================="
log "✓ Merge successful and all tests passed!"
log "========================================="
echo ""
echo -e "${GREEN}Branch:${NC} $BRANCH_NAME"
echo -e "${GREEN}Merge branch:${NC} $MERGE_BRANCH"
echo -e "${GREEN}Log file:${NC} $LOG_FILE"
echo ""
echo "Next steps:"
echo "1. Review the changes: git log main..$MERGE_BRANCH"
echo "2. Test manually if needed: npm run dev"
echo "3. When ready, merge to main:"
echo "   git checkout main"
echo "   git merge $MERGE_BRANCH"
echo "   git push origin main"
echo "4. Delete remote branch:"
echo "   git push origin --delete $BRANCH_NAME"
echo "5. Delete local merge branch:"
echo "   git branch -d $MERGE_BRANCH"
echo ""
echo -e "${YELLOW}Or use the finalize script:${NC}"
echo "   ./scripts/finalize-merge.sh $BRANCH_NAME"
