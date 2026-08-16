// Everything the search needs, loaded on demand.
//
// This module is only ever reached through a dynamic import (see SearchBar.svelte)
// so that the word index (~278 KB), the documentation contents and `marked` stay
// out of the root layout chunk, which every page of the site downloads.

export type Occurrence = { start: number; end: number };
export type SearchRecord = Record<string, Occurrence[]>;

export type SearchIndex = {
	wordIndex: Record<string, SearchRecord>;
	textContent: Record<string, string>;
};

const META_RGX = /^---\n(.*)\n---/s;

let pending: Promise<SearchIndex> | undefined;

const build = async (): Promise<SearchIndex> => {
	const [wordIndexJson, content, { marked }] = await Promise.all([
		import('$lib/wordIndex.gen.json?raw').then((m) => m.default),
		import('$lib/content.gen').then((m) => m.default),
		import('marked')
	]);

	const textContent: Record<string, string> = {};
	for (const [name, md] of Object.entries(content)) {
		textContent[name] = (await marked.parse(md.replace(META_RGX, ''))).replace(/<[^>]*>?/gm, '');
	}

	return { wordIndex: JSON.parse(wordIndexJson), textContent };
};

/** Loads (once) and returns the search index. Safe to call repeatedly. */
export const loadSearchIndex = (): Promise<SearchIndex> => (pending ??= build());

/** Finds the documents matching every word in `req`, with their match offsets. */
export const searchIndex = ({ wordIndex }: SearchIndex, req: string): [string, Occurrence[]][] => {
	const words = req
		.replace(/[\s_\-\/\.:,;?*"'`(){}<>\[\]@&=!#]/, ' ')
		.trim()
		.split(' ')
		.filter(Boolean);

	if (!words.length) return [];

	const acc: Record<string, SearchRecord> = {};

	for (const [w, v] of Object.entries(wordIndex)) {
		for (const kw of words) {
			if (!w.includes(kw.toLocaleLowerCase())) continue;
			for (const [f, occs] of Object.entries(v)) {
				acc[kw] ??= {};
				acc[kw][f] ??= [];
				acc[kw][f].push(...occs);
			}
		}
	}

	// Keep only the documents matching every searched word.
	const intersection = Object.values(acc).reduce<SearchRecord>((entries, current, i) => {
		if (i === 0) return current;
		const inter: SearchRecord = {};
		for (const [eK, eV] of Object.entries(current)) {
			if (eK in entries) inter[eK] = [...entries[eK], ...eV];
		}
		return inter;
	}, {});

	return Object.entries(intersection);
};
