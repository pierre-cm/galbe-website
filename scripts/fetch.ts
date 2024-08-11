import yaml from 'js-yaml';
import { readdirSync, renameSync, existsSync, rmSync, mkdirSync } from 'fs';
import { resolve, extname, dirname } from 'path';
import config from '../config';
import { marked } from 'marked';
import plugins from '../plugins.json';

type PluginRecord = {
	name: string;
	repo: string;
	image?: string;
	github?: string;
	description?: string;
	readme?: string;
	npm?: string;
};

const isGit = extname(config?.repository || '') === '.git';
if (isGit) {
	if (existsSync('.docs')) {
		let proc = Bun.spawn({
			cwd: '.docs',
			cmd: ['git', 'pull'],
			stdout: 'inherit'
		});
		await proc.exited;
	} else {
		console.log('GITHUB_TOKEN found ?', !!config?.git?.token);
		let proc = Bun.spawn({
			cmd: [
				'git',
				'clone',
				'-n',
				'--depth=1',
				'--filter=tree:0',
				config.git.token
					? `https://${config.git.token}@github.com/${config.git.repo}.git`
					: `git@github.com:${config.git.repo}.git`,
				'.docs'
			],
			stdout: 'inherit'
		});
		await proc.exited;
		proc = Bun.spawn({
			cwd: '.docs',
			cmd: ['git', 'sparse-checkout', 'set', '--no-cone', 'docs'],
			stdout: 'inherit'
		});
		await proc.exited;
		proc = Bun.spawn({
			cwd: '.docs',
			cmd: ['git', 'checkout'],
			stdout: 'inherit'
		});
		await proc.exited;
		readdirSync('.docs/docs').forEach((file) => {
			renameSync(resolve('.docs/docs', file), resolve('.docs', file));
		});
		rmSync('.docs/docs', { recursive: true, force: true });
	}
}
const repoPath = isGit ? '.docs' : `${config?.repository}/docs`;

const sitemapStr = await Bun.file('sitemap.yaml').text();
const sitemap = yaml.load(sitemapStr) as Record<string, any>;

export const buildSitemap = async (
	sitemap: Record<
		string,
		{
			label: string;
			title?: string;
			description?: string;
			editUrl?: string;
			kind: 'doc';
			file?: string;
			items?: any;
			next?: { title: string; path: string };
			prev?: { title: string; path: string };
		}
	>,
	path: string,
	filter: string[] = []
) => {
	const entries = Object.entries(sitemap || {});
	const index: Record<string, Record<string, { start: number; end: number }[]>> = {};

	// Plugins
	const dest = resolve(path, 'plugins.json');

	let auth = Bun.env.GH_TOKEN ? { headers: { Authorization: `token ${Bun.env.GH_TOKEN}` } } : {};

	for (let [kp, vp] of Object.entries(plugins as Record<string, PluginRecord>)) {
		let [_, owner, repo] = [
			...(vp.repo.match(/https:\/\/github.com\/([^(/]+)\/([^/]+)\.git$/) || [])
		];
		let resp = await fetch(`https://api.github.com/repos/${owner}/${repo}`, auth).then((resp) =>
			resp.json()
		);
		plugins[kp].description = plugins[kp]?.description || resp.description;
		plugins[kp].github = resp.html_url;
		resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, auth).then((resp) =>
			resp.json()
		);
		plugins[kp].readme = atob(resp.content);
	}

	mkdirSync(dirname(dest), { recursive: true });
	console.log('Writing', dest);
	Bun.write(dest, JSON.stringify(plugins, null, 2));

	// Doc files
	for await (const [idx, [name, val]] of entries.entries()) {
		if (val.kind === 'doc') {
			const src = val?.file ? resolve(repoPath, val?.file) : null;

			const prev = idx <= 0 ? null : entries[idx - 1];
			const next = idx >= entries.length - 1 ? null : entries[idx + 1];

			if (prev) val.prev = { title: prev[1]?.title || '', path: `/documentation/${prev[0]}` };
			if (next) val.next = { title: next[1]?.title || '', path: `/documentation/${next[0]}` };

			if (filter?.length === 0 || (src && filter.includes(src))) {
				const dest = resolve(path, `${name}.md`);
				let mdCore = src ? await Bun.file(src).text() : '';
				let mdText = (await marked.parse(mdCore)).replace(/<[^>]*>?/gm, '');
				let md = `---\n${yaml.dump(val, { indent: 2 })}\n${val.file ? `editUrl: https://github.com/${config.git.repo}/blob/main/docs/${val.file}\n` : ''}---\n${mdCore}`;
				console.log('Writing', dest);
				mkdirSync(dirname(dest), { recursive: true });
				Bun.write(dest, md);
				const rgx = /[^\s_\-\/\.:,;?*"'`(){}<>\[\]@&=!#]+/gi;
				let match;
				while ((match = rgx.exec(mdText)) !== null) {
					let w = match?.[0]?.toLowerCase();
					if (!w) continue;
					if (!index?.[w]) index[w] = {};
					if (!index[w]?.[name]) index[w][name] = [];
					index[w][name].push({ start: match.index, end: rgx.lastIndex });
				}
			}
		}
	}

	Bun.write('src/lib/wordIndex.gen.json', JSON.stringify(index));

	const docNames = Object.entries(sitemap || {})
		.filter(([_, v]) => v.kind === 'doc')
		.map(([k]) => k);
	let exporterTS =
		'// This file is auto-generated. DO NOT EDIT\n' +
		'// See scripts/fetch.ts\n' +
		`${docNames.map((name, idx) => `import _${idx} from '$lib/contents/${name}.md?raw';`).join('\n')}\n\n` +
		`const content = {\n` +
		`${docNames.map((name, idx) => `  '${name}': _${idx}`).join(',\n')}\n` +
		`} as Record<string, string>;\n` +
		`export default content;\n`;

	Bun.write('src/lib/content.gen.ts', exporterTS);
};
await buildSitemap(sitemap, resolve('src/lib/contents'));
