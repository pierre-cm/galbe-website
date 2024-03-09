export default {
	repository: Bun.env.GALBE_REPO,
	git: {
		token: Bun.env.GH_TOKEN,
		repo: Bun.env.GH_REPO
	},
	site: `https://${Bun.env.GALBE_DOMAIN}`,
	base: Bun.env.GALBE_BASE
};
