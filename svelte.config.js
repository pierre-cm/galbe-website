// import adapter from 'svelte-adapter-bun';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		prerender: {
			handleMissingId: 'warn'
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
