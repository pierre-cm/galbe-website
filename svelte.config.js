// import adapter from 'svelte-adapter-bun';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		prerender: {
			handleMissingId: 'warn',
			// The documentation markdown is pulled from the framework repo and still
			// contains links relative to that repo's layout. They 404 on the site, but
			// they should not fail the build.
			handleHttpError: 'warn'
		},
		adapter: adapter({
			out: 'dist',
			envPrefix: 'GALBE_',
			precompress: true,
			fallback: '404.html'
		})
	}
};

export default config;
