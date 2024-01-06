export default {
  repository: process.env.KADRE_REPO,
  git: {
    token: process.env.GH_TOKEN,
    repo: process.env.GH_REPO,
  },
  site: `https://${process.env.KADRE_DOMAIN}`,
  base: process.env.KADRE_BASE,
}
