export default {
  repository: "git@github.com:pierre-cm/kadre.git",
  // repository: "../kadre",
  git: {
    username: Bun.env.GITHUB_USER,
    token: Bun.env.GITHUB_TOKEN,
    repo: "pierre-cm/kadre",
  },
}
