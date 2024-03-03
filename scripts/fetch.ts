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
		console.log('GH_TOKEN found ?', !!config?.git?.token);
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
		}
	>,
	path: string,
	filter: string[] = []
) => {
	for (const [name, val] of Object.entries(sitemap || {})) {
		if ('md' in val) {
			const src = resolve(repoPath, val?.md || '');
			const dest = resolve(path, basename(src));
			if (filter?.length === 0 || filter.includes(src)) {
				let f = await Bun.file(src).text();
				f = `---\ntitle: ${val?.title}\ndescription: ${val?.description}\neditUrl: https://github.com/${config.git.repo}/blob/main/docs/${val?.md}\n---\n${f}`;
				console.log('Writing', dest);
				mkdirSync(dirname(dest), { recursive: true });
				Bun.write(dest, f);
			}
		} else if ('items' in val) {
			buildSitemap(val.items, `${path}/${name}`, filter);
		}
	}
};
await buildSitemap(sitemap, resolve('src/lib/contents'));
