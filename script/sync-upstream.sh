#!/usr/bin/env bash
# sync-upstream.sh — merge latest anomalyco/opencode into dev
# Usage: ./script/sync-upstream.sh

set -e

UPSTREAM_REMOTE="upstream"
UPSTREAM_BRANCH="dev"
LOCAL_BRANCH="dev"

# Files we've customized — flag if upstream also touched them
WATCH_FILES=(
  "packages/opencode/src/config/config.ts"
  "packages/opencode/src/config/paths.ts"
  "packages/opencode/src/global/index.ts"
  "packages/opencode/src/installation/index.ts"
  "packages/opencode/src/flag/flag.ts"
  "packages/opencode/src/cli/logo.ts"
  "packages/opencode/src/cli/ui.ts"
  "packages/opencode/src/cli/cmd/tui/thread.ts"
  "packages/opencode/src/cli/cmd/upgrade.ts"
  "packages/opencode/src/cli/cmd/run.ts"
  "packages/opencode/script/build.ts"
  "packages/opencode/package.json"
)

echo "==> Checking working tree..."
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERROR: Uncommitted changes detected. Stash or commit before syncing."
  exit 1
fi

CURRENT=$(git branch --show-current)
if [ "$CURRENT" != "$LOCAL_BRANCH" ]; then
  echo "ERROR: Must be on '$LOCAL_BRANCH' branch (currently on '$CURRENT')"
  exit 1
fi

echo "==> Fetching upstream (anomalyco/opencode)..."
git fetch "$UPSTREAM_REMOTE"

BEHIND=$(git rev-list --count HEAD.."$UPSTREAM_REMOTE/$UPSTREAM_BRANCH")
if [ "$BEHIND" -eq 0 ]; then
  echo "==> Already up to date with upstream."
  exit 0
fi

echo "==> $BEHIND new commit(s) from upstream:"
git log --oneline HEAD.."$UPSTREAM_REMOTE/$UPSTREAM_BRANCH"
echo ""

echo "==> Checking for conflicts with our customized files..."
CONFLICTS=()
for f in "${WATCH_FILES[@]}"; do
  if git diff --name-only HEAD "$UPSTREAM_REMOTE/$UPSTREAM_BRANCH" | grep -q "^$f$"; then
    CONFLICTS+=("$f")
  fi
done

if [ ${#CONFLICTS[@]} -gt 0 ]; then
  echo "⚠️  Upstream touched files we've customized — review carefully after merge:"
  for f in "${CONFLICTS[@]}"; do
    echo "   - $f"
  done
  echo ""
fi

echo "==> Merging upstream/$UPSTREAM_BRANCH..."
git merge "$UPSTREAM_REMOTE/$UPSTREAM_BRANCH" --no-edit -m "chore: merge upstream anomalyco/opencode into dev"

echo ""
echo "✅ Sync complete."
if [ ${#CONFLICTS[@]} -gt 0 ]; then
  echo "   Review the flagged files above for any conflicts with our customizations."
fi
echo "   Run 'bun install && cd packages/opencode && bun run script/build.ts --single --skip-install' to rebuild."
