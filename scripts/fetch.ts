import yaml from 'js-yaml';
import { readdirSync, renameSync, existsSync, rmSync, mkdirSync } from 'fs';
import { resolve, basename, extname, dirname } from 'path';
import config from '../config';

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
			md?: string;
			items?: any;
			next?: { title: string; path: string };
			prev?: { title: string; path: string };
		}
	>,
	path: string,
	filter: string[] = []
) => {
	const entries = Object.entries(sitemap || {});
	for await (const [idx, [name, val]] of entries.entries()) {
		const src = val?.md ? resolve(repoPath, val?.md) : null;

		const prev = idx <= 0 ? null : entries[idx - 1];
		const next = idx >= entries.length - 1 ? null : entries[idx + 1];

		if (prev) val.prev = { title: prev[1]?.title || '', path: `/documentation/${prev[0]}` };
		if (next) val.next = { title: next[1]?.title || '', path: `/documentation/${next[0]}` };

		if (filter?.length === 0 || (src && filter.includes(src))) {
			const dest = resolve(path, `${name}.md`);
			let f = src ? await Bun.file(src).text() : '';
			f = `---\n${yaml.dump(val, { indent: 2 })}\n${val.md ? `editUrl: https://github.com/${config.git.repo}/blob/main/docs/${val.md}\n` : ''}---\n${f}`;
			console.log('Writing', dest);
			mkdirSync(dirname(dest), { recursive: true });
			Bun.write(dest, f);
		}
	}

	let exporterTS = `${entries
		.map(([name, _], idx) => `import _${idx} from '$lib/contents/${name}.md?raw';`)
		.join('\n')}
	
export default {
${entries.map(([name, _], idx) => `  '${name}': _${idx}`).join(',\n')}
} as Record<string, string>;`;
	Bun.write('src/lib/content.ts', exporterTS);
};
await buildSitemap(sitemap, resolve('src/lib/contents'));
