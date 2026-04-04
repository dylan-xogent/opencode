# Rebrand: OpenCode → Awareness

**New name:** Awareness  
**Domain:** awareness.dev  
**Status:** Pending — do this when the product is ready for public release

Substitution map:
| From | To |
|------|----|
| `opencode` | `awareness` |
| `OpenCode` | `Awareness` |
| `@opencode-ai/` | `@awareness/` |
| `opencode.ai` | `awareness.dev` |
| `.opencode/` | `.awareness/` |
| `opencode.jsonc` | `awareness.jsonc` |
| CLI binary `opencode` | `awareness` |
| GitHub repo `dylan-xogent/opencode` | `dylan-xogent/awareness` |

---

## CLI & Binary

- [ ] `packages/opencode/package.json` — `"name": "opencode"` → `"name": "awareness"`
- [ ] `packages/opencode/bin/opencode` — rename file to `awareness` + update shebang references
- [ ] All references to the `opencode` CLI command in docs, README, and scripts

## npm Packages (`@opencode-ai/*` → `@awareness/*`)

- [ ] `packages/app` — `@opencode-ai/app` → `@awareness/app`
- [ ] `packages/desktop` — `@opencode-ai/desktop` → `@awareness/desktop`
- [ ] `packages/desktop-electron` — `@opencode-ai/desktop-electron` → `@awareness/desktop-electron`
- [ ] `packages/enterprise` — `@opencode-ai/enterprise` → `@awareness/enterprise`
- [ ] `packages/function` — `@opencode-ai/function` → `@awareness/function`
- [ ] `packages/plugin` — `@opencode-ai/plugin` → `@awareness/plugin`
- [ ] `packages/script` — `@opencode-ai/script` → `@awareness/script`
- [ ] `packages/slack` — `@opencode-ai/slack` → `@awareness/slack`
- [ ] `packages/ui` — `@opencode-ai/ui` → `@awareness/ui`
- [ ] `packages/util` — `@opencode-ai/util` → `@awareness/util`
- [ ] `packages/web` — `@opencode-ai/web` → `@awareness/web`
- [ ] `packages/sdk/js` — `@opencode-ai/sdk` → `@awareness/sdk`
- [ ] All `import ... from "@opencode-ai/..."` in source files

## Config Files

- [ ] `.opencode/` config directory → `.awareness/`
- [ ] `opencode.jsonc` → `awareness.jsonc`
- [ ] `$schema: "https://opencode.ai/config.json"` → `"https://awareness.dev/config.json"`
- [ ] `$schema: "https://opencode.ai/tui.json"` → `"https://awareness.dev/tui.json"`
- [ ] `.opencode/.gitignore` and `.opencode/env.d.ts` paths updated accordingly
- [ ] `**/.omc` in `.gitignore` → `**/.awareness-state` or keep as-is (internal runtime dir)

## Domain & URLs

- [ ] `opencode.ai` in all `package.json` `homepage` fields → `awareness.dev`
- [ ] Schema URLs in config files (see above)
- [ ] Any hardcoded `opencode.ai` API URLs in source
- [ ] GitHub repo rename: `dylan-xogent/opencode` → `dylan-xogent/awareness`
- [ ] Update `origin` remote after repo rename

## Source Code Identity

- [ ] `packages/opencode/src/` — internal product name strings
- [ ] TUI title bar and in-app branding strings
- [ ] `session-title.ts` and other display strings
- [ ] Design a logo/ASCII art for the `home_logo` slot in the workspace plugin

## GitHub & CI

- [ ] `.github/workflows/` — hardcoded repo/package name references
- [ ] `github/script/publish`, `github/script/release` scripts
- [ ] `sdks/vscode/` — VS Code extension name, display name, command prefix

## Agent Config (`.opencode/` → `.awareness/`)

- [ ] `tui.json` plugin paths (currently `./plugins/tui-smoke.tsx`)
- [ ] Agent files that reference "opencode" as a product name
- [ ] Update `opencode.jsonc` schema URL → `awareness.jsonc`

## Extensions

- [ ] `packages/extensions/zed/extension.toml` — extension name → Awareness
- [ ] `sdks/vscode/package.json` — display name + command prefix

## Website (awareness.dev)

- [ ] Download page for CLI binary (macOS, Linux, Windows)
- [ ] Installation instructions (`curl -fsSL awareness.dev/install | sh`)
- [ ] Basic docs / getting started
- [ ] The `/install` script currently in repo root — update domain reference

---

## Execution Plan

When ready:

```bash
# 1. Dry-run scope check
grep -r "opencode" . \
  --include="*.ts" --include="*.tsx" --include="*.json" \
  --include="*.jsonc" --include="*.md" --include="*.toml" \
  -l | grep -v node_modules | grep -v .git | grep -v REBRAND.md

# 2. Run the rebrand via Dylan pipeline
# Tell Dylan: "Execute the rebrand from OpenCode to Awareness per REBRAND.md"
# Dylan will route → planner → architect → builder (with reviewer-strict since
# this touches CI, config, and public API surface simultaneously)

# 3. After rebrand: rename GitHub repo, update remote
git remote set-url origin https://github.com/dylan-xogent/awareness
```

**Estimated scope:** ~200-300 files, mostly mechanical. Highest-risk items:
1. CLI binary rename (breaks existing users' PATH)
2. npm scope change (`@opencode-ai/` → `@awareness/`) — requires republishing all packages
3. Config directory rename (`.opencode/` → `.awareness/`) — breaks existing user configs

All three need migration notes in the release changelog.
