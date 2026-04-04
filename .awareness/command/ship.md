---
description: "Bump version, generate changelog, and create a release PR. Usage: /ship [patch|minor|major] [--dry-run]"
model: openrouter/anthropic/claude-sonnet-4.6
---

Prepare a release for this project. Argument format: `[patch|minor|major] [--dry-run]`

Default bump type is `patch` if not specified. With `--dry-run`, show what would change without writing anything.

## Step 1: Validate state

```bash
# Must be on dev branch
git branch --show-current

# Working tree must be clean (committed)
git status --short

# Confirm we're ahead of origin
git log --oneline origin/dev..HEAD | head -5
```

If the working tree has uncommitted changes, stop and tell the user to commit or stash first.

## Step 2: Determine current version and compute new version

```bash
cat packages/opencode/package.json | grep '"version"'
```

Parse the current semver (e.g. `1.3.14`) and compute the new version based on the bump type:
- `patch`: `1.3.14` → `1.3.15`
- `minor`: `1.3.14` → `1.4.0`
- `major`: `1.3.14` → `2.0.0`

## Step 3: Find all package.json files with this version

```bash
grep -r '"version": "CURRENT_VERSION"' packages/*/package.json packages/sdk/*/package.json sdks/*/package.json
```

All packages in this monorepo share the same version number. Collect every file that needs updating.

## Step 4: Update versions (skip if --dry-run)

For each file found in Step 3, update `"version": "CURRENT"` → `"version": "NEW"`.

Also check the root `package.json` if it has a version field.

## Step 5: Generate changelog

```bash
# Generate UPCOMING_CHANGELOG.md from commits since last tag
bun script/changelog.ts 2>/dev/null || echo "Changelog script not available — summarize commits manually"
```

If the script fails or isn't available, generate a changelog from git log:

```bash
git log --oneline $(git describe --tags --abbrev=0 2>/dev/null || echo "HEAD~20")..HEAD \
  | grep -v "^[a-f0-9]* Merge" \
  | grep -v "^[a-f0-9]* chore: generate" \
  | grep -v "^[a-f0-9]* chore: update nix"
```

Group commits into sections: Core, TUI, Agents/Pipeline, Developer Experience, Bug Fixes.
Skip: merge commits, "chore: generate", version bumps, internal CI changes.

Write to `UPCOMING_CHANGELOG.md`.

## Step 6: Create release branch and PR (skip if --dry-run)

```bash
# Create release branch
git checkout -b release/vNEW_VERSION

# Stage version bumps and changelog
git add packages/*/package.json packages/sdk/*/package.json sdks/*/package.json UPCOMING_CHANGELOG.md

# Commit
git commit -m "release: vNEW_VERSION"

# Push
git push origin release/vNEW_VERSION

# Create PR targeting dev
gh pr create \
  --base dev \
  --title "release: vNEW_VERSION" \
  --body "$(cat UPCOMING_CHANGELOG.md)"
```

## Step 7: Output

Print a summary:
- Old version → new version
- Files updated (count)
- Changelog highlights (top 5 bullets)
- PR URL

If `--dry-run`, print everything but prefix with `[DRY RUN]` and skip Steps 4 and 6.

## Input

$ARGUMENTS
