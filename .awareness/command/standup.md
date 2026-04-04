---
description: Generate a daily standup summary from recent git activity and open PRs
model: openrouter/anthropic/claude-haiku-4.5
---

Generate a concise daily standup summary for Dylan. Structure it as:

**Yesterday** — What was completed (commits since yesterday 9am)
**Today** — What's in progress (uncommitted changes, open PRs, pending work)
**Blockers** — Anything failing, conflicted, or stalled

Rules:
- Be specific. Name files, features, and outcomes — not "worked on stuff"
- Skip merge commits, version bumps, and chore/generate commits unless they unblock something
- If a commit message is vague, check the diff with `git show --stat <hash>` to describe the real change
- Keep each bullet to one line
- If there's nothing in a section, omit it entirely

## Git log (last 24h)

!`git log --oneline --since="24 hours ago" --author="$(git config user.name)" 2>/dev/null || git log --oneline -10`

## Uncommitted changes

!`git status --short`

!`git diff --stat HEAD`

## Open PRs

!`gh pr list --author "@me" --state open --json number,title,state,isDraft,reviewDecision,statusCheckRollup 2>/dev/null || echo "gh CLI not available or not authenticated"`

## Recent branches with activity

!`git for-each-ref --sort=-committerdate --format='%(refname:short) %(committerdate:relative)' refs/heads/ | head -5`

$ARGUMENTS
