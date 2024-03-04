export function load({ url }) {
	return {
		url: url.pathname,
		rootSlug: url.pathname?.split('/')[1]
	};
}
