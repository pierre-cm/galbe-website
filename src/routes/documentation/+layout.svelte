<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte';
	import contents from '$lib/content';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import yaml from 'js-yaml';

	const META_RGX = /^---\n(.*)\n---/s;
	const DEFAULT_PAGE = 'getting-started';
	const QUERY_HEADERS = 'main .content h2 a, main .content h3 a, main .content h4 a';
	const aside = [
		{ label: 'Getting started', ref: '/documentation/getting-started' },
		{ label: 'Routes', ref: '/documentation/routes' },
		{ label: 'Schemas', ref: '/documentation/schemas' },
		{ label: 'Hooks', ref: '/documentation/hooks' },
		{ label: 'Handler', ref: '/documentation/handler' },
		{ label: 'Lifecycle', ref: '/documentation/lifecycle' },
		{ label: 'Router', ref: '/documentation/router' },
		{ label: 'Plugins', ref: '/documentation/plugins' }
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

<svelte:head>
	<title>Galbe | Doc</title>
</svelte:head>

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
			<div class="nav-buttons">
				<a class="nav-button prev" class:hidden={!meta.prev} href={meta?.prev?.url}>
					<div class="label">PREVIOUS</div>
					<div class="title">{meta?.prev?.label}</div>
				</a>
				<a class="nav-button next" class:hidden={!meta.next} href={meta?.next?.url}>
					<div class="label">NEXT</div>
					<div class="title">{meta?.next?.label}</div>
				</a>
			</div>
		</div>

		<div class="aside-content">
			<div class="aside-content-body">
				<div class="title">On this page</div>
				<div class="aside-content-items">
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
				{#if meta?.editUrl}
					<div class="editButton">
						<a href={meta.editUrl} target="_blank">
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
				.aside-content {
					display: flex;
				}
			}
		}
	}
</style>
