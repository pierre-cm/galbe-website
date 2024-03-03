<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte';
	import contents from '$lib/content';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const META_RGX = /^---\n(.*)\n---/s;
	const DEFAULT_PAGE = 'getting-started';
	const QUERY_HEADERS = 'main .content h2, main .content h3, main .content h4';
	const aside = [
		{ label: 'Getting started', ref: '/documentation/getting-started' },
		{ label: 'Routes', ref: '/documentation/routes' },
		{ label: 'Schemas', ref: '/documentation/schemas' },
		{ label: 'Hooks', ref: '/documentation/hooks' },
		{ label: 'Handler', ref: '/documentation/handler' },
		{ label: 'Router', ref: '/documentation/router' },
		{ label: 'Lifecycle', ref: '/documentation/lifecycle' },
		{ label: 'Plugins', ref: '/documentation/plugins' }
	];

	let meta: Record<string, string> = $state({});
	let titles: { level: number; title: string; ref: string }[] = $state([]);
	let mdCore: string = $state('');

	let currentPage = $state(DEFAULT_PAGE);
	let content = $state('');
	let currentSection = $state();

	const scrolling = () => {
		const mdTitles = document.querySelectorAll('main .content h2');
		let last = null;

		for (let t of [...mdTitles]) {
			if (window.scrollY > (t as HTMLElement).offsetTop) last = t;
			else break;
		}
		currentSection = last?.innerHTML;
	};
	const clickSection = (title: string, ref: string) => {
		if (ref === window.location.hash) {
			const mdTitles = document.querySelectorAll(QUERY_HEADERS);
			for (let s of mdTitles) {
				if (s.innerHTML === title) {
					window.scrollTo({ top: (s as HTMLElement).offsetTop + 8, behavior: 'smooth' });
				}
			}
		}
	};

	$effect(() => {
		const url = $page.url;

		const loc = url.pathname.replace(/^\/documentation\/?/, '') || DEFAULT_PAGE;
		if (loc !== currentPage) currentPage = loc;

		setTimeout(() => {
			const mdTitles = document.querySelectorAll(QUERY_HEADERS);
			for (let title of titles) {
				if (title.ref === url.hash) {
					for (let s of mdTitles) {
						if (s.innerHTML === title.title) {
							window.scrollTo({ top: (s as HTMLElement).offsetTop + 8, behavior: 'smooth' });
						}
					}
					break;
				}
			}
		});
	});

	$effect(() => {
		let c = contents[currentPage];
		if (c && c !== content) {
			content = c;
			let mdMetaMatch = content.match(META_RGX);
			let _meta: typeof meta = {};
			if (mdMetaMatch) {
				for (let record of mdMetaMatch[1].split('\n')) {
					let r = record.match(/^([^:]*):(.*)$/);
					if (r) _meta[r[1].trim()] = r[2].trim();
				}
			}
			meta = _meta;

			mdCore = content.replace(META_RGX, '');

			let titlesMatch = mdCore.matchAll(/\s(#+)\s+([^\n]+)/gm);
			titles = [];
			for (let tm of titlesMatch || []) {
				let level = tm[1].length;
				let title = tm[2].trim();
				titles.push({ level, title, ref: `#${title.toLowerCase().replace(/\s+/g, '-')}` });
			}
		}
	});

	onMount(() => {
		scrolling();
	});
</script>

<svelte:window on:scroll={scrolling} />

<div class="page">
	<main>
		<aside>
			<nav>
				{#each aside as { ref, label }}
					<a href={ref} class:active={$page.url.pathname === ref}>{label}</a>
				{/each}
			</nav>
		</aside>
		<div class="content">
			<Markdown input={mdCore} />
			<slot />
		</div>
		<div class="aside-content">
			<div class="aside-content-body">
				<div class="title">On this page</div>
				{#each titles as { level, title, ref }}
					{#if level === 2}
						<a
							href={ref}
							class:active={currentSection === title}
							on:click={() => clickSection(title, ref)}
						>
							{title}
						</a>
					{/if}
				{/each}
			</div>
		</div>
	</main>
</div>

<style lang="scss">
	.page {
		display: flex;
		justify-content: center;
		main {
			position: relative;
			width: 90rem;
			max-width: 100vw;
			display: flex;
			justify-content: space-between;
			aside {
				display: none;
				min-width: 12rem;
				padding: 0.5rem 0 0.5rem 0;
				border-right: 1px solid var(--border);
				nav {
					position: fixed;
					width: 12rem;
					display: flex;
					flex-direction: column;
					a {
						text-decoration: none;
						color: var(--text);
						font-weight: 600;
						padding: 0.5rem 1rem 0.5rem 1rem;
						&.active {
							color: var(--primary);
						}
						&:hover {
							background-color: var(--background-v1);
						}
					}
				}
			}
			.content {
				min-width: 10rem;
				max-width: 55rem;
				padding: 0 1.5rem 2rem 1.5rem;
			}
			.aside-content {
				position: relative;
				display: none;
				min-width: 15rem;

				.aside-content-body {
					display: flex;
					position: fixed;
					flex-direction: column;
					font-size: 0.9rem;
					min-width: 15rem;
					height: 100%;
					padding: 1rem 2rem 1rem 2rem;
					.title {
						font-weight: 600;
						margin-bottom: 1rem;
					}
					a {
						text-decoration: none;
						color: var(--text);
						padding: 0.5rem;
						border-left: 2px solid var(--border);
						&.active {
							border-left-color: var(--primary);
							color: var(--primary);
						}
					}
				}
			}
		}
	}
	@media (min-width: 1024px) {
		.page {
			main {
				aside {
					display: block;
				}
				.aside-content {
					display: flex;
				}
			}
		}
	}
</style>
