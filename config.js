export default {
  repository: process.env.KADRE_REPO,
  git: {
    token: process.env.GH_TOKEN,
    repo: process.env.GH_REPO,
  },
  site: process.env.KADRE_SITE,
  base: process.env.KADRE_BASE,
}
