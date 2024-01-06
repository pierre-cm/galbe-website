export default {
  repository: Bun.env.KADRE_REPO,
  git: {
    token: Bun.env.GH_TOKEN,
    repo: Bun.env.GH_REPO,
  },
  site: Bun.env.KADRE_SITE,
  base: Bun.env.KADRE_BASE,
}
