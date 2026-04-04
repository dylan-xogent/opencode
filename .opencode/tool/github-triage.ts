/// <reference path="../env.d.ts" />
import { tool } from "@opencode-ai/plugin"

// Update OWNER/REPO to match this fork's repository
const OWNER = "dylan-xogent"
const REPO = "opencode"

// Labels available in this repo — extend as needed
const LABELS = ["bug", "feature", "docs", "ci", "tui", "core", "plugin", "upstream", "needs-triage"] as const
type Label = (typeof LABELS)[number]

function getIssueNumber(): number {
  const issue = parseInt(process.env.ISSUE_NUMBER ?? "", 10)
  if (!issue) throw new Error("ISSUE_NUMBER env var not set")
  return issue
}

async function githubFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

export default tool({
  description: `Use this tool to label a GitHub issue in dylan-xogent/opencode.
Choose the most appropriate labels based on the issue content.
If the issue appears to be from upstream (anomalyco/opencode), add the "upstream" label.`,
  args: {
    labels: tool.schema
      .array(tool.schema.enum(LABELS as [Label, ...Label[]]))
      .describe("Labels to add to the issue")
      .default(["needs-triage"]),
  },
  async execute(args) {
    const issue = getIssueNumber()
    const results: string[] = []

    const labels = [...new Set(args.labels)]

    if (labels.length > 0) {
      await githubFetch(`/repos/${OWNER}/${REPO}/issues/${issue}/labels`, {
        method: "POST",
        body: JSON.stringify({ labels }),
      })
      results.push(`Added labels to #${issue}: ${labels.join(", ")}`)
    }

    return results.join("\n")
  },
})
