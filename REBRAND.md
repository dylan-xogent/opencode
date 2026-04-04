# Rebrand Inventory

When a new name is chosen, this is the complete list of touch points to update.
Replace `<newname>` with the chosen name (lowercase), `<NewName>` (PascalCase), `<NEWNAME>` (uppercase).

## CLI & Binary

- [ ] `packages/opencode/package.json` — `"name": "opencode"` → `"name": "<newname>"`
- [ ] `packages/opencode/bin/opencode` — rename file + shebang references
- [ ] All references to the `opencode` CLI command in docs, README, and scripts

## npm Packages (`@opencode-ai/*` → `@<newname>/*`)

- [ ] `packages/app` — `@opencode-ai/app`
- [ ] `packages/desktop` — `@opencode-ai/desktop`
- [ ] `packages/desktop-electron` — `@opencode-ai/desktop-electron`
- [ ] `packages/enterprise` — `@opencode-ai/enterprise`
- [ ] `packages/function` — `@opencode-ai/function`
- [ ] `packages/plugin` — `@opencode-ai/plugin`
- [ ] `packages/script` — `@opencode-ai/script`
- [ ] `packages/slack` — `@opencode-ai/slack`
- [ ] `packages/ui` — `@opencode-ai/ui`
- [ ] `packages/util` — `@opencode-ai/util`
- [ ] `packages/web` — `@opencode-ai/web`
- [ ] `packages/sdk/js` — `@opencode-ai/sdk`
- [ ] All `import ... from "@opencode-ai/..."` references in source files

## Config Files

- [ ] `.opencode/` config directory → `.<newname>/`
- [ ] `opencode.jsonc` → `<newname>.jsonc`
- [ ] `$schema: "https://opencode.ai/config.json"` → new schema URL
- [ ] `$schema: "https://opencode.ai/tui.json"` → new schema URL
- [ ] `.opencode/.gitignore` → `.<newname>/.gitignore`

## Domain & URLs

- [ ] `opencode.ai` references in package.json `homepage` fields
- [ ] Schema URLs in `opencode.jsonc` and `tui.json`
- [ ] Any hardcoded `opencode.ai` API URLs in source
- [ ] GitHub repo: `dylan-xogent/opencode` → `dylan-xogent/<newname>`

## Source Code Identity

- [ ] `packages/opencode/src/` — internal references to "opencode" as a product name
- [ ] TUI title bar and any in-app branding strings
- [ ] The `home_logo` ASCII art in the workspace plugin (currently disabled)
- [ ] `session-title.ts` and other display strings

## GitHub & CI

- [ ] `.github/workflows/` — any hardcoded repo or package name references
- [ ] `github/script/publish`, `github/script/release` scripts
- [ ] `sdks/vscode/` — VS Code extension name and display name

## Agent Config (`.opencode/` → `.<newname>/`)

- [ ] All agent/command/tool file paths in any configs that reference `.opencode/`
- [ ] `tui.json` plugin paths
- [ ] Any agent files that reference "opencode" as a product name

## Extensions

- [ ] `packages/extensions/zed/extension.toml` — extension name
- [ ] `sdks/vscode/package.json` — extension display name and command prefix

## Rough Estimate

~200-300 files touched, mostly mechanical find-and-replace. The CLI binary rename and
npm scope change are the highest-risk items (consumers of the published packages).

## When Ready

1. Pick the name
2. Do a dry-run: `grep -r "opencode" . --include="*.ts" --include="*.json" --include="*.jsonc" --include="*.md" -l | grep -v node_modules | grep -v .git`
3. Update this checklist
4. Run the rebrand via the Dylan pipeline (feature development → builder)
