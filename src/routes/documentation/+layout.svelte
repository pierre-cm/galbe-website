<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import contents from '$lib/content.gen';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import yaml from 'js-yaml';

	const META_RGX = /^---\n(.*)\n---/s;
	const DEFAULT_PAGE = 'getting-started';
	const QUERY_HEADERS = 'main .content h2 a, main .content h3 a, main .content h4 a';
	const aside = [
		{ title: 'Getting started', ref: '/documentation/getting-started' },
		{ title: 'Configuration', ref: '/documentation/configuration' },
		{ title: 'Lifecycle', ref: '/documentation/lifecycle' },
		{ separator: true },
		{ title: 'Router', ref: '/documentation/router' },
		{ title: 'Error Handler', ref: '/documentation/error-handler' },
		{ separator: true },
		{ title: 'Routes', ref: '/documentation/routes' },
		{ title: 'Schemas', ref: '/documentation/schemas' },
		{ title: 'Hooks', ref: '/documentation/hooks' },
		{ title: 'Handler', ref: '/documentation/handler' },
		{ title: 'Context', ref: '/documentation/context' },
		{ separator: true },
		{ title: 'CLI', ref: '/documentation/cli' },
		{ title: 'Plugins', ref: '/documentation/plugins' },
		{ separator: true },
		{ title: 'Contribute', ref: '/documentation/contribute' }
	];

	let meta: Record<string, any> = $state({});
	let titles: { level: number; title: string; ref: string }[] = $state([]);
	let mdCore: string = $state('');

	let currentPage = $state(DEFAULT_PAGE);
	let content = $state('');
	let currentSection = $state();

	const scrolling = () => {
		const mdTitles = document.querySelectorAll('main .content h2 a');
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
			meta = mdMetaMatch ? (yaml.load(mdMetaMatch[1]) as Record<string, any>) : {};
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

<Meta
	title={`${meta.title ? `${meta.title} | ` : ''}Galbe Doc`}
	description={meta.description ||
		'Documentation for in-depth guidance on using our Galbe framework. Find detailed explanations, code examples, and best practices to help you build fast and versatile backend servers.'}
/>

<svelte:window on:scroll={scrolling} />

<div class="page">
	<main>
		<aside>
			<nav>
				{#each aside as { ref, title, separator }}
					{#if separator}
						<div class="separator"></div>
					{:else}
						<a href={ref} class:active={$page.url.pathname === ref}>{title}</a>
					{/if}
				{/each}
			</nav>
		</aside>
		<div class="content">
			{#if mdCore?.trim()}
				<Markdown input={mdCore} />
			{/if}
			<slot />
			<div class="nav-buttons">
				<a class="nav-button prev" class:hidden={!meta.prev} href={meta?.prev?.path}>
					<div class="label">PREVIOUS</div>
					<div class="title">{meta?.prev?.title}</div>
				</a>
				<a class="nav-button next" class:hidden={!meta.next} href={meta?.next?.path}>
					<div class="label">NEXT</div>
					<div class="title">{meta?.next?.title}</div>
				</a>
			</div>
		</div>

		<div class="aside-content">
			<div class="aside-content-body">
				{#if titles?.filter((t) => t.level === 2)?.length}
					<div class="title">On this page</div>
					<div class="aside-content-items">
						{#each titles as { level, title, ref }}
							{#if level === 2}
								<a
									href={ref}
									class:active={currentSection === title}
									onclick={() => clickSection(title, ref)}
								>
									{title}
								</a>
							{/if}
						{/each}
					</div>
				{/if}
				{#if meta?.editUrl}
					<div class="editButton">
						<a href={meta.editUrl} target="_blank" rel="noopener noreferrer">
							<Icon name="edit" width="1rem" height="1rem" />
							Edit on Github
						</a>
					</div>
				{/if}
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
					.separator {
						width: calc(100% - 1rem);
						height: 0.5rem;
						margin-bottom: 0.5rem;
						border-bottom: 1px solid var(--border);
					}
				}
			}
			.content {
				min-width: 10rem;
				max-width: 55rem;
				padding: 0 1.5rem 2rem 1.5rem;
				display: flex;
				flex-direction: column;
				gap: 2rem;
				.nav-buttons {
					display: flex;
					justify-content: space-between;
					gap: 2rem;
					.nav-button {
						cursor: pointer;
						padding: 1rem;
						border: 1px solid var(--text-v1);
						border-radius: 0.5rem;
						flex-basis: 100%;
						display: flex;
						flex-direction: column;
						&:hover {
							border-color: var(--primary);
							color: var(--primary);
							text-decoration: none;
						}
						&.next {
							align-items: flex-end;
						}
						&.hidden {
							visibility: hidden;
						}
						.label {
							font-size: 0.8rem;
							color: var(--text-v1);
						}
						.title {
							white-space: nowrap;
						}
					}
				}
			}
			.aside-content {
				position: relative;
				display: none;
				min-width: 15rem;

				.aside-content-body {
					display: flex;
					position: fixed;
					flex-direction: column;
					gap: 1rem;
					font-size: 0.9rem;
					min-width: 15rem;
					height: 100%;
					padding: 1rem 2rem 1rem 2rem;
					.title {
						font-weight: 600;
					}
					.aside-content-items {
						display: flex;
						flex-direction: column;
						& > a {
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
	}
	@media (min-width: 1024px) {
		.page {
			main {
				aside {
					display: block;
				}
				.content {
					min-width: 55rem;
				}
				.aside-content {
					display: flex;
				}
			}
		}
	}
</style>
