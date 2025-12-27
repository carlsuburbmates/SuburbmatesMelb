#!/bin/bash

# Finalize Merge Script
# Purpose: Complete the merge process by pushing to main and cleaning up
# Usage: ./scripts/finalize-merge.sh <branch-name>

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [ -z "$1" ]; then
  echo -e "${RED}Error: Branch name required${NC}"
  echo "Usage: ./scripts/finalize-merge.sh <branch-name>"
  exit 1
fi

BRANCH_NAME="$1"
MERGE_BRANCH="merge/$BRANCH_NAME"

log() {
  echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Confirmation
echo ""
echo -e "${YELLOW}You are about to finalize the merge:${NC}"
echo "  Branch: $BRANCH_NAME"
echo "  Merge branch: $MERGE_BRANCH"
echo ""
echo "This will:"
echo "  1. Merge $MERGE_BRANCH into main"
echo "  2. Push main to remote"
echo "  3. Delete remote branch $BRANCH_NAME"
echo "  4. Delete local merge branch $MERGE_BRANCH"
echo ""
read -p "Continue? (yes/no): " -r
echo

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo "Aborted."
  exit 1
fi

# Step 1: Checkout main
log "Step 1: Checking out main..."
git checkout main || { error "Failed to checkout main"; exit 1; }

# Step 2: Merge the merge branch
log "Step 2: Merging $MERGE_BRANCH into main..."
git merge "$MERGE_BRANCH" --no-ff -m "Finalize merge of $BRANCH_NAME" || { error "Merge failed"; exit 1; }

# Step 3: Push to remote
log "Step 3: Pushing to origin/main..."
git push origin main || { error "Push failed"; exit 1; }

# Step 4: Delete remote branch
log "Step 4: Deleting remote branch $BRANCH_NAME..."
if git push origin --delete "$BRANCH_NAME"; then
  log "✓ Remote branch deleted"
else
  warning "Failed to delete remote branch (may already be deleted)"
fi

# Step 5: Delete local merge branch
log "Step 5: Deleting local merge branch $MERGE_BRANCH..."
git branch -d "$MERGE_BRANCH" || { warning "Failed to delete merge branch"; }

echo ""
log "========================================="
log "✓ Merge finalized successfully!"
log "========================================="
echo ""
echo -e "${GREEN}Branch $BRANCH_NAME has been merged into main and deleted.${NC}"
echo ""
echo "Next steps:"
echo "1. Update MERGE_PROGRESS.md to mark this branch as complete"
echo "2. Continue with the next branch in the merge plan"
echo "3. Monitor for any issues"
