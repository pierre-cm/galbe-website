import yaml from 'js-yaml';
import { resolve, extname } from 'path';
import { watch, existsSync } from 'fs';
import config from '../config';
import { buildSitemap } from './fetch';
import { $ } from 'bun';

if (config?.repository && existsSync(config.repository)) {
	const isGit = extname(config.repository) === '.git';
	const sitemapStr = await Bun.file('sitemap.yaml').text();
	const sitemap = yaml.load(sitemapStr) as Record<string, any>;

	const srcDir = resolve(import.meta.dir, '..', config?.repository, 'docs');
	console.log('SRC_DIR', srcDir);
	if (!isGit) {
		watch(srcDir, (event, filename) => {
			console.log(`Detected ${event} in ${resolve(srcDir, filename as string)}`);
			buildSitemap(sitemap, resolve('src/lib/contents'), [resolve(srcDir, filename as string)]);
		});
	}
}

await $`bun run vite:dev`;

export {};
