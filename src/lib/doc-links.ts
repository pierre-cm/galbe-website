// Rewrites the links found inside the documentation markdown.
//
// The markdown is authored in the framework repository, so its links point at
// that repository's file layout (`../reference/cli.md`, `context.md`, ...) and
// are relative to the file they appear in. Left alone, the browser resolves them
// against the site URL instead, which is why `../reference/cli.md` used to land
// on /reference/cli and 404. Here they are resolved against the document's own
// source path and then mapped onto the published site path.

import metadata from '$lib/meta.gen';

const MD_EXT = /\.md(?=$|[#?])/;

/**
 * Heading anchor slug, matching the convention the documentation is written
 * against (GitHub's): lowercase, punctuation dropped, spaces to hyphens. So
 * `responseValidator.enabled` is reachable as #responsevalidatorenabled.
 *
 * Used both by the markdown renderer and by the "On this page" sidebar, which
 * have to agree on the ids.
 */
export const slugify = (text: string): string =>
	text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-');

/** `concepts/routes` -> `/documentation/routes`, built from the site map. */
const siteBySource: Record<string, string> = {};
/** Base of the repository blob URLs, e.g. `https://github.com/…/blob/main/docs/`. */
let blobBase = '';

for (const [slug, meta] of Object.entries(metadata)) {
	if (!meta?.file) continue;
	siteBySource[String(meta.file).replace(MD_EXT, '')] = `/documentation/${slug}`;
	if (!blobBase && meta.editUrl) blobBase = String(meta.editUrl).replace(String(meta.file), '');
}

/** Resolves `rel` against the directory holding `base`, POSIX style. */
const resolve = (base: string, rel: string) => {
	const segments = base.split('/').slice(0, -1);
	for (const part of rel.split('/')) {
		if (part === '' || part === '.') continue;
		if (part === '..') segments.pop();
		else segments.push(part);
	}
	return segments.join('/');
};

/**
 * Maps a markdown link onto its published location.
 *
 * `base` is the source path of the document being rendered (`concepts/routes.md`).
 * Without it — plugin READMEs, for instance — links keep their previous handling.
 */
export const resolveDocLink = (href: string, base?: string): string => {
	if (!href || /^([a-z]+:|\/\/|#|\/)/i.test(href)) return href;
	if (!base) return href.replace(MD_EXT, '');
	if (!MD_EXT.test(href)) return href;

	const [path, anchor = ''] = href.split(/(#.*)$/);
	const source = resolve(base, path.replace(MD_EXT, ''));

	const site = siteBySource[source];
	if (site) return `${site}${anchor}`;

	// A document that exists upstream but is not published on the site: send the
	// reader to the source rather than to a dead page.
	return blobBase ? `${blobBase}${source}.md${anchor}` : href.replace(MD_EXT, '');
};
