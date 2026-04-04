const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production" ? "https://awareness.dev" : `https://${stage}.awareness.dev`,
  console: stage === "production" ? "https://awareness.dev/auth" : `https://${stage}.awareness.dev/auth`,
  email: "contact@anoma.ly",
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/anomalyco/opencode",
  discord: "https://awareness.dev/discord",
  headerLinks: [
    { name: "app.header.home", url: "/" },
    { name: "app.header.docs", url: "/docs/" },
  ],
}
